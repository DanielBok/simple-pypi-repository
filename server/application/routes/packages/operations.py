from pathlib import Path

from flask import abort, request, render_template
from werkzeug.datastructures import FileStorage


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
    def __init__(self, package_folder: str):
        package_folder = package_folder.strip()
        if package_folder == "":
            raise ValueError("upload folder value cannot be an empty string")

        self.package_folder = Path(package_folder)
        if not self.package_folder.exists():
            self.package_folder.mkdir(600, True, True)

    def upload_package(self):
        pkg_root = self.package_folder.parent.joinpath("packages")
        if 'content' not in request.files:
            abort(400, "No content found")

        file: FileStorage = request.files['content']
        if not file.filename.endswith(".tar.gz") and not file.filename.endswith('.whl'):
            abort(400, "Invalid file format. Package build package with sdist or wheel")

        name = request.form.get('name', None)
        if name is None:
            abort(400, 'Package name is not specified')

        pkg_path = pkg_root.joinpath(name, file.filename)
        if pkg_path.exists():
            abort(400, "Package already exists. To force an overwrite, use the '-f' flag in twine or "
                       "set force to True in the form post")

        file.save(pkg_path.as_posix())
        return "Okay", 200
