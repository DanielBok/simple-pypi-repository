from flask import Blueprint

from application.libs import PackageFolder

bp = Blueprint("project_api", __name__)


@bp.route("/<project>")
def get_project_details(project):
    folder = PackageFolder(project)

    return {
        "name": project,
        "latest_version": folder.latest_version,
        "projects": folder.version_info_list
    }
