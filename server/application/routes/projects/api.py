from pathlib import Path

from flask import Blueprint, current_app, jsonify

from application.utils import get_account
from .filesys import package_information

bp = Blueprint("project_api", __name__)


@bp.route("/<username>")
def get_projects(username):
    account = get_account(abort_if_invalid=False, username=username)

    return jsonify([{
        **p.to_dict(),
        **package_information(Path(current_app.config['PACKAGE_FOLDER']).joinpath(p.name))
    } for p in account.packages])
