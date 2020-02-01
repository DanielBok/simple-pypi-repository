import os
from pathlib import Path
from typing import Optional

from flask import abort, render_template, request, send_file
from werkzeug.datastructures import FileStorage

from application.models import Account, Package
from .file import PackageFilesHandler
from .meta import UserAgent


def get_account():
    if request.authorization is None:
        abort(403, "No credentials provided")

    username = request.authorization['username']
    password = request.authorization['password']
    if username == "" or password == "":
        abort(403, "No credentials provided. Please ensure you have a registered account")

    account = Account.find_account(username, password)
    if account is None:
        abort(403, "Invalid account credentials.Please ensure you have a valid registered account")

    return account


class GetHandler:
    def __init__(self, package_folder: str):
        package_folder = package_folder.strip()
        if package_folder == "":
            raise ValueError("upload folder value cannot be an empty string")

        self.package_folder = Path(package_folder)
        if not self.package_folder.exists():
            self.package_folder.mkdir(600, True, True)

    def render_index(self):
        packages = []
        for path in self.package_folder.iterdir():
            if path.is_dir():
                packages.append({"link": f"/simple/{path.name}", "title": path.name})

        return render_template("index.html", packages=packages)

    def render_package_information(self, package_name: str):
        package = Package.find_by_name(package_name)
        folder = self.package_folder.joinpath(package_name)

        packages = []
        for path in folder.iterdir():
            if path.is_file() and (path.name.endswith('.whl') or path.name.endswith('.tar.gz')):
                packages.append({"link": f"/simple/{package_name}/{path.name}", "title": path.name})

        return render_template('package-info.html', name=package_name, packages=packages, private=package.private)

    def send_pip_package(self, user_agent: UserAgent, package_name: str):
        # TODO check pip install implementation
        package = Package.find_by_name(package_name)
        if package.private:
            token = self._get_token()
            if token is None or not package.has_token(token):
                abort(403, "Not allowed to download private package without valid credentials")
        handler = PackageFilesHandler(self.package_folder.joinpath(package_name), user_agent)

        if handler.latest is None:
            abort(404, "Package not found")

        # TODO add version checker when pip is used like "pip install perfana>=0.0.8"
        return send_file(handler.latest.path)

    def send_package(self, package_name: str, filename: str):
        package = Package.find_by_name(package_name)
        if package.private:
            token = self._get_token()
            if token is None or not package.has_token(token):
                abort(403, "Not allowed to download private package without valid credentials")

        return send_file(self.package_folder.joinpath(package_name, filename).as_posix(),
                         attachment_filename=filename)

    @staticmethod
    def _get_token() -> Optional[str]:
        if request.authorization is None:
            return None
        return request.authorization['username']


class PostHandler:
    def __init__(self, folder: str, name: str):
        folder = folder.strip()
        if folder == "":
            raise ValueError("upload folder value cannot be an empty string")

        self.package_folder = Path(folder).joinpath(name)
        if not self.package_folder.exists():
            self.package_folder.mkdir(600, True, True)

    def upload_package(self, allow_override: bool):
        if 'content' not in request.files:
            abort(400, "No content found")

        file: FileStorage = request.files['content']
        if not file.filename.endswith(".tar.gz") and not file.filename.endswith('.whl'):
            abort(400, "Invalid file format. Package build package with sdist or wheel")

        pkg_path = self.package_folder.joinpath(file.filename)
        if pkg_path.exists():
            if not allow_override:
                abort(400, "Package already exists and cannot be overwritten. To enable overwrite, set "
                           "the allow_override option to True via the api")
            else:
                os.remove(pkg_path.as_posix())

        file.save(pkg_path.as_posix())
        return "Okay", 200
