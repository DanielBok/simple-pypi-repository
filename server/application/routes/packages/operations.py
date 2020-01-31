import os
from pathlib import Path

from flask import abort, render_template, request
from werkzeug.datastructures import FileStorage

from application.models import Account


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
        packages = [
            {"link": "/simple/packageName/", "title": "title"}
        ]

        return render_template("index.html", packages=packages)


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
