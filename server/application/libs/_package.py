import os
import re
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from shutil import rmtree

from flask import current_app
from markdown import markdown
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

            info = self._get_package_info(p.as_posix())
            packages[info.version].append({
                "filename": p.name,
                "size": os.path.getsize(p.as_posix()),
                "type": "Wheel" if p.name.endswith(".whl") else "Source",
                "python_version": pv,
                "upload_date": datetime.fromtimestamp(os.path.getmtime(p.as_posix())).strftime("%b %d, %Y"),
            })

        output = []
        for version, files in packages.items():
            info = self._get_package_info(files[0]['filename'])

            max_date = max(files, key=lambda x: datetime.strptime(x['upload_date'], "%b %d, %Y"))['upload_date']
            output.append({
                "version": version,
                "summary": info.summary,
                "release_date": max_date,
                "description": markdown(info.description),
                "content_type": info.description_content_type,
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
        packages = [p for p in self.path.iterdir() if self._get_package_info(p.as_posix()).version == version]
        for p in packages:
            os.remove(p.as_posix())

        return len(packages)

    @property
    def package_summary(self):
        return p.summary if (p := self.latest_package) is not None else ""

    @property
    def last_upload_date(self):
        return datetime.fromtimestamp(os.path.getmtime(path)).strftime("%d %b %Y") if \
            (path := self._last_uploaded_file_path) is not None \
            else ""

    @property
    def latest_version(self):
        return p.version if (p := self.latest_package) is not None else ""

    @property
    def latest_package(self):
        return self._get_package_info(path) if (path := self._last_uploaded_file_path) is not None else None

    @property
    def _last_uploaded_file_path(self):
        if len(list(self.path.iterdir())) == 0:
            return None

        return max(self.path.iterdir(), key=lambda x: os.path.getmtime(x.as_posix())).as_posix()

    def _get_package_info(self, filename: str):
        fp = self.path.joinpath(filename).as_posix()
        return Wheel(fp) if fp.endswith('.whl') else SDist(fp)
