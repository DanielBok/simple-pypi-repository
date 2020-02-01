import re

from flask import Blueprint, abort, current_app, request

from application.models import Package
from .meta import UserAgent
from .operations import GetHandler, PostHandler, get_account

bp = Blueprint("packages", __name__, template_folder="templates")


@bp.route('/', defaults={'path': ''}, methods=["GET"])
@bp.route('/<path:path>', methods=["GET"])
def index(path: str):
    folder = current_app.config['PACKAGE_FOLDER']
    handler = GetHandler(folder)
    if path == '':
        return handler.render_index()

    components = path.split('/')
    if len(components) == 1:
        user_agent = UserAgent()
        if user_agent.is_pip:
            return handler.send_pip_package(user_agent, path)
        return handler.render_package_information(path)

    elif len(components) == 2:
        package_name, file = components
        return handler.send_package(package_name, file)
    else:
        abort(404, "Not a valid path")


@bp.route('/', methods=['POST'])
def upload_package():
    account = get_account()

    package_name = get_formatted_package_name()

    package = Package.find_by_name(package_name)
    if package is None:
        package = Package(package_name, False, False)
        account.packages.append(package)
        account.save()
    elif package.account != account:
        abort(403, "Invalid credentials. Please ensure that you have the right credentials")

    folder = current_app.config['PACKAGE_FOLDER']
    return PostHandler(folder, package_name).upload_package(package.allow_override)


def get_formatted_package_name():
    package_name: str = request.values.get('name', '').strip().lower()
    if package_name == "":
        abort(400, 'package name not provided')

    if re.fullmatch('[_a-z0-9]+', package_name) is None:
        abort(400, 'Package name should only consist of lower-case alphabets, underscores and numbers. '
                   'See https://www.python.org/dev/peps/pep-0008/#package-and-module-names for more '
                   'information')

    return package_name
