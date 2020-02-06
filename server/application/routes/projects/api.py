from flask import Blueprint, abort

from application.libs import PackageFolder
from application.models import Package

bp = Blueprint("project_api", __name__)


@bp.route("/<project>")
def get_project_details(project):
    p = Package.find_by_name(project)
    if p is None:
        abort(404, f"Package/project '{project}' does not exist")
    folder = PackageFolder(project)

    return {
        "name": project,
        "latest_version": folder.latest_version,
        "private": p.private,
        "projects": folder.version_info_list
    }
