import os
from pathlib import Path
from shutil import rmtree

from flask import current_app
from pkginfo import SDist, Wheel


class PackageFolder:
    def __init__(self, name: str):
        self.path = Path(current_app.config['PACKAGE_FOLDER']).joinpath(name)

    def remove_all_packages(self):
        num_files = len(list(self.path.iterdir()))
        rmtree(self.path, True)
        return num_files

    def remove_version(self, version: str):
        packages = []
        for p in self.path.iterdir():
            info = Wheel(p.as_posix()) if p.name.endswith('.whl') else SDist(p.as_posix())
            if info.version == version:
                packages.append(p)

        for p in packages:
            os.remove(p.as_posix())

        return len(packages)
