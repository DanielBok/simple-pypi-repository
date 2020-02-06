from flask import Blueprint, abort, jsonify, request

from application.libs import PackageFolder, get_account
from application.models import PackageLock
from .utils import _fetch_validated_package, _package_details

bp = Blueprint("package_api", __name__)


@bp.route("/")
def get_all_user_packages():
    account = get_account()
    return jsonify([_package_details(p) for p in account.packages])


@bp.route('/', methods=['PUT'])
def update_package_settings():
    data = request.get_json()
    package = _fetch_validated_package(data['package'])

    package.update(data['allow_override'], data['private'])
    return package.to_dict()


@bp.route('/<package_name>', methods=['GET'])
def get_package_details(package_name: str):
    package = _fetch_validated_package(package_name)
    return _package_details(package)


@bp.route('/<package_name>/lock', methods=['POST'])
def create_lock(package_name: str):
    data = request.get_json()
    package = _fetch_validated_package(package_name)
    return package.add_package_lock(data['description'], data.get('token', '')).to_dict()


@bp.route("/<package_name>/lock/<int:lock_id>", methods=['DELETE'])
def remove_lock(package_name: str, lock_id: int):
    package = _fetch_validated_package(package_name)

    lock = PackageLock.find_by_id(lock_id)
    if lock is None:
        abort(404, "lock does not exist")
    elif lock.package_id != package.id:
        abort(400, "lock does not belong to package")
    else:
        lock.delete()
        return "Okay", 200


@bp.route("/<package_name>/manage", methods=['DELETE'])
def remove_package(package_name):
    package = _fetch_validated_package(package_name)
    folder = PackageFolder(package.name)

    folder.remove_all_packages()
    package.delete()
    return "Okay", 200


@bp.route("/<package_name>/manage/<version>", methods=['DELETE'])
def remove_package_version(package_name, version):
    package = _fetch_validated_package(package_name)
    folder = PackageFolder(package.name)

    folder.remove_version(version)
    return jsonify(folder.version_info_list)
