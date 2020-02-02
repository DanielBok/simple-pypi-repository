from pathlib import Path
from shutil import rmtree

from flask import Blueprint, abort, current_app, request

from application.models import PackageLock
from .operations import get_account

bp = Blueprint("package_api", __name__)


@bp.route('/', methods=['PUT'])
def update_package_settings():
    data = request.get_json()
    package = _fetch_validated_package(data['package'])

    package.update(data['allow_override'], data['private'])
    return package.to_dict()


@bp.route("/", methods=["DELETE"])
def delete_package():
    data = request.get_json()
    pkg = _fetch_validated_package(data['package'])

    pkg_folder = Path(current_app.config['PACKAGE_FOLDER']).joinpath(pkg.name)
    if pkg_folder.exists():
        rmtree(pkg_folder, True)

    pkg.delete()
    return "", 200


@bp.route('/<package_name>', methods=['GET'])
def get_package_details(package_name: str):
    package = _fetch_validated_package(package_name)
    return package.to_dict(True)


@bp.route('/<package_name>/lock', methods=['POST'])
def create_lock(package_name: str):
    data = request.get_json()
    package = _fetch_validated_package(package_name)
    return package.add_package_lock(data.get('description', '')).to_dict()


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


def _fetch_validated_package(package_name: str):
    account = get_account()
    package = account.find_package(package_name)  # checks if package exists within the account's package list
    if package is None:
        abort(400, "Account does not own package. Please ensure that you have uploaded the package or that the "
                   "account you are using is the owner of the package")

    return package
