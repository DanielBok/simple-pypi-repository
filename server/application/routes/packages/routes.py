from flask import Blueprint, current_app, abort, request

from .operations import GetHandler, PostHandler

bp = Blueprint("packages", __name__, template_folder="templates")


@bp.route('/', defaults={'path': ''}, methods=["GET", "POST", "DELETE"])
@bp.route('/<path:path>', methods=["GET", "POST", "DELETE"])
def index(path):
    folder = current_app.config['PACKAGE_FOLDER']
    if request.method == "GET":
        handler = GetHandler(folder)
        if path == '':
            return handler.render_index()

    if request.method == "POST":
        return PostHandler(folder).upload_package()

    return abort(405, "")
