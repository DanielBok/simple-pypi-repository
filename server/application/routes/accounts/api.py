from pathlib import Path
from shutil import rmtree

from flask import Blueprint, abort, current_app, request

from application.models import Account

bp = Blueprint("accounts", __name__, template_folder="templates")


@bp.route("/", methods=['POST'])
def create_account():
    data = request.get_json()
    account = Account(**data)
    if Account.find_account(data['username']) is not None:
        abort(400, f"Username '{data['username']}' is already taken")
    elif Account.find_account(data['email']) is not None:
        abort(400, f"Email '{data['email']}' is already taken")

    try:
        return account.save().to_dict()
    except Exception as e:
        current_app.logger.error(e)
        abort(400, "could not create account")


@bp.route("/", methods=["PUT"])
def update_account():
    data = request.get_json()

    account = Account.find_account(data['username'], data['password'])
    if account is None:
        abort(401, "invalid account credentials")

    new_details = data['new_details']
    return account.update(**new_details).to_dict()


@bp.route("/", methods=["DELETE"])
def delete_account():
    data = request.get_json()

    account = Account.find_account(data['username'], data['password'])
    if account is None:
        abort(401, "invalid account credentials")

    folder = Path(current_app.config['PACKAGE_FOLDER'])
    for p in account.packages:
        pkg_folder = folder.joinpath(p.name)
        if pkg_folder.exists():
            rmtree(pkg_folder, True)

    account.delete()
    return "", 200


@bp.route("/validate", methods=['POST'])
def validate_account():
    error_message = "could not find account or password is incorrect"

    data = request.get_json()

    account = Account.find_account(data['username'], data['password'])
    if account is None:
        abort(404, error_message)

    return "", 200


@bp.route("/check-exists/<user_or_email>")
def check_user_or_email_exists(user_or_email):
    if Account.find_account(user_or_email) is None:
        return "", 404
    else:
        return "", 200
