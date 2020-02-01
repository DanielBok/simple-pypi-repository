import os
from base64 import b64decode
from pathlib import Path
from typing import Optional

import pkginfo
from flask import abort, render_template, request, send_file
from werkzeug.datastructures import FileStorage

from application.models import Account, Package


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
        if package is None:
            return abort(404, "package does not exist in repository")

        folder = self.package_folder.joinpath(package_name)
        payload = {
            "name": package_name,
            "packages": [],
            "use_prompt": package.private and not self.is_pip,
        }

        if self.is_pip and package.private and not package.is_valid_token(self.token):
            return render_template('package-info.html', **payload)

        for path in folder.iterdir():
            filename = path.name
            if path.is_file() and (filename.endswith('.whl') or filename.endswith('.tar.gz')):
                filepath = path.as_posix()
                info = pkginfo.Wheel(filepath) if filename.endswith('.whl') else pkginfo.SDist(filepath)

                payload["packages"].append({"link": f"/simple/{package_name}/{path.name}",
                                            "title": path.name,
                                            "requires_python": info.requires_python})

        return render_template('package-info.html', **payload)

    def send_package(self, package_name: str, filename: str):
        package = Package.find_by_name(package_name)
        if package.private and not package.is_valid_token(self.token):
            abort(403, "Not allowed to download private package without valid credentials")

        return send_file(self.package_folder.joinpath(package_name, filename).as_posix(),
                         attachment_filename=filename)

    @property
    def token(self) -> Optional[str]:
        if (auth_str := request.headers.get('Authorization', "")) != "":
            return b64decode(auth_str.split()[1]).decode()

        if request.authorization is None:
            return None
        return request.authorization['username']

    @property
    def is_pip(self) -> bool:
        return request.user_agent.string.lower().startswith("pip")


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
