import os
from datetime import datetime
from pathlib import Path

from pkginfo import SDist, Wheel


def package_information(fp: Path):
    # latest file path
    path = max(fp.iterdir(), key=lambda x: os.path.getmtime(x.as_posix())).as_posix()
    info = Wheel(path) if path.endswith('.whl') else SDist(path)
    details = _version_details(fp)

    return {"summary": info.summary,
            "release_date": datetime.fromtimestamp(os.path.getmtime(path)).strftime("%d %b %Y"),
            "version_details": details}


def _version_details(fp: Path):
    packages = {}

    for p in fp.iterdir():
        path = p.as_posix()
        info = Wheel(path) if path.endswith('.whl') else SDist(path)

        if info.version not in packages:
            packages[info.version] = {"create_time": 0., "wheel": 0, "source": 0}

        if path.endswith('.whl'):
            packages[info.version]['wheel'] += 1
        else:
            packages[info.version]['source'] += 1

        if (create_time := os.path.getmtime(path)) > packages[info.version]['create_time']:
            packages[info.version]['create_time'] = create_time

    details = []
    for ver, v in packages.items():
        details.append({
            "version": ver,
            "release_date": datetime.fromtimestamp(v['create_time']).strftime("%d %b %Y"),
            "wheel": v['wheel'],
            "source": v['source']
        })

    return details
