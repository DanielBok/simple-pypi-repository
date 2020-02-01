import re
from pathlib import Path

from .meta import UserAgent

# regex for package names
wheel_regex = re.compile(r"([\w_\-]+)-([\w.]+)-(cp\d+|py\d(?:.py\d)?)-(?:cp\d+m?|none)-([\w_]+).whl")
source_regex = re.compile(r"([\w_\-]+)-([\w.]+).tar.gz")


class PackageParseException(Exception):
    def __init__(self, name: str):
        super().__init__(f"unable to parse package: '{name}'")


class PackageFile:
    def __init__(self, filepath: Path):
        self.name = filepath.name
        self.path = filepath.as_posix()

        if not filepath.exists():
            raise FileNotFoundError(f"Path to {self.name} does not exist")

        if self.name.endswith('.whl'):
            try:
                self.package, self.version, self.abi, self.platform = wheel_regex.fullmatch(self.name).groups()
                self.is_64_bit = self.platform.endswith('64')
                self.is_source = False
            except ValueError:
                raise PackageParseException(self.name)
        elif self.name.endswith('.tar.gz'):
            self.package, self.version = source_regex.fullmatch(self.name).groups()
            self.abi, self.platform = "", ""
            self.is_64_bit, self.is_source = True, True
        else:
            raise ValueError("Package file extension should be either a wheel or source distribution")

    def can_download(self, user_agent):
        if self.abi == "py2.py3" or \
                (self.abi == "py3" and user_agent.python_version.startswith('3')) or \
                (self.abi == "py2" and user_agent.python_version.startswith('2')):
            return True

        if self.is_source:
            return True

        if user_agent.is_64_bit != self.is_64_bit:
            return False

        if self.abi.startswith('cp'):
            abi_version = '.'.join(self.abi[2:])
            if user_agent.implementation != "cpython" or user_agent.python_version < abi_version:
                return False

            return (self.platform == "windows" and user_agent.platform.startswith("win")) or \
                   (self.platform == "linux" and user_agent.platform.startswith("manylinux")) or \
                   (self.platform == "osx" and user_agent.platform.startswith("macosx"))

        return False

    def __repr__(self):
        return f"<PackageFile name='{self.name}'"


class PackageFilesHandler:
    def __init__(self, package_folder: Path, user_agent: UserAgent):
        self.packages = []
        for p in package_folder.iterdir():
            if p.name.endswith('.tar.gz') or p.name.endswith('.whl'):
                if (file := PackageFile(p)).can_download(user_agent):
                    self.packages.append(file)

        self.packages.sort(key=lambda x: (x.version, not x.is_source, x.abi), reverse=True)

    def get_version(self, version):
        # TODO implement this
        raise NotImplementedError

    @property
    def latest(self):
        return self.packages[0] if len(self.packages) > 0 else None
