from flask import Blueprint, abort, current_app, request

from application.models import Package
from .operations import GetHandler, PostHandler, get_account

bp = Blueprint("packages", __name__, template_folder="templates")


@bp.route('/', defaults={'path': ''}, methods=["GET"])
@bp.route('/<path:path>', methods=["GET"])
def index(path):
    folder = current_app.config['PACKAGE_FOLDER']
    handler = GetHandler(folder)
    if path == '':
        return handler.render_index()
    else:
        abort(404, "Not implemented")


@bp.route('/', methods=['POST'])
def upload_package():
    account = get_account()
    if (package_name := request.values.get('name', '').strip()) == '':
        abort(400, 'package name not provided')

    package = Package.find_by_name(package_name)
    if package is None:
        package = Package(package_name, False, False)
        account.packages.append(package)
        account.save()
    elif package.account != account:
        abort(403, "Invalid credentials. Please ensure that you have the right credentials")

    folder = current_app.config['PACKAGE_FOLDER']
    return PostHandler(folder, package_name).upload_package(package.allow_override)
