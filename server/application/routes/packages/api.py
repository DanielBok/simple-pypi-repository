from flask import Blueprint, abort, jsonify, request

from application.models import Package, PackageLock
from application.routes.projects.package_info import version_details
from application.utils import get_account
from .filesys import PackageFolder

bp = Blueprint("package_api", __name__)


@bp.route('/', methods=['PUT'])
def update_package_settings():
    data = request.get_json()
    package = _fetch_validated_package(data['package'])

    package.update(data['allow_override'], data['private'])
    return package.to_dict()


@bp.route('/<package_name>', methods=['GET'])
def get_package_details(package_name: str):
    package = _fetch_validated_package(package_name)
    return package.to_dict(True)


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
    return jsonify(version_details(folder.path))


def _fetch_validated_package(package_name: str) -> Package:
    account = get_account()
    package = account.find_package(package_name)  # checks if package exists within the account's package list
    if package is None:
        abort(400, "Account does not own package. Please ensure that you have uploaded the package or that the "
                   "account you are using is the owner of the package")

    return package
