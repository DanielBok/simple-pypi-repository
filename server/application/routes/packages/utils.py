from flask import abort

from application.libs import PackageFolder, get_account
from application.models import Package


def _fetch_validated_package(package_name: str) -> Package:
    account = get_account()
    package = account.find_package(package_name)  # checks if package exists within the account's package list
    if package is None:
        abort(400, "Account does not own package. Please ensure that you have uploaded the package or that the "
                   "account you are using is the owner of the package")

    return package


def _package_details(p: Package):
    folder = PackageFolder(p.name)
    return {
        **p.to_dict(True),
        "version_details": folder.version_info_list,
        "summary": folder.package_summary,
        "release_date": folder.last_upload_date,
    }
