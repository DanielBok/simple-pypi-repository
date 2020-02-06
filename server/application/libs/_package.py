import os
import re
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from shutil import rmtree

from flask import current_app
from pkginfo import SDist, Wheel


class PackageFolder:
    def __init__(self, name: str):
        self.path = Path(current_app.config['PACKAGE_FOLDER']).joinpath(name)

    @property
    def exists(self):
        return self.path.exists()

    @property
    def version_info_list(self):
        if not self.exists:
            return []

        wheel_regex = re.compile(r"[\w_\-]+-[\w.]+-(cp\d+|py\d(?:.py\d)?)-(?:cp\d+m?|none)-[\w_]+.whl")

        packages = defaultdict(list)
        for p in self.path.iterdir():
            is_wheel = p.name.endswith(".whl")
            pv = "None"
            if is_wheel:
                if (match := wheel_regex.fullmatch(p.name)) is not None:
                    pv = match.group(1)

            info = Wheel(p.as_posix()) if is_wheel else SDist(p.as_posix())
            packages[info.version].append({
                "filename": p.name,
                "size": os.path.getsize(p.as_posix()),
                "type": "Wheel" if p.name.endswith(".whl") else "Source",
                "python_version": pv,
                "upload_date": datetime.fromtimestamp(os.path.getmtime(p.as_posix())).strftime("%b %d, %Y"),
            })

        output = []
        for version, files in packages.items():
            max_date = max(files, key=lambda x: datetime.strptime(x['upload_date'], "%b %d, %Y"))
            output.append({
                "version": version,
                "release_date": max_date,
                "files": files,
                "count": {
                    "wheel": sum(1 if x['filename'].endswith('.whl') else 0 for x in files),
                    "source": sum(1 if x['filename'].endswith('.tar.gz') else 0 for x in files)
                }
            })

        return output

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

    @property
    def package_summary(self):
        if (path := self._last_uploaded_file_path) is None:
            return ""
        else:
            return Wheel(path) if path.endswith('.whl') else SDist(path).summary

    @property
    def last_upload_date(self):
        if (path := self._last_uploaded_file_path) is None:
            return None
        else:
            return datetime.fromtimestamp(os.path.getmtime(path)).strftime("%d %b %Y")

    @property
    def _last_uploaded_file_path(self):
        if len(list(self.path.iterdir())) == 0:
            return None

        return max(self.path.iterdir(), key=lambda x: os.path.getmtime(x.as_posix())).as_posix()
