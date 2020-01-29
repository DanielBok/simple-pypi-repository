from flask import Blueprint, abort, jsonify, request

from application.models import Account

bp = Blueprint("accounts", __name__, template_folder="templates")


@bp.route("/", methods=['POST'])
def create_account():
    data = request.get_json()
    account = Account(**data)
    try:
        return jsonify(account.save().to_dict())
    except Exception as e:
        print(e)
        abort(400, "could not create account", e)


@bp.route("/", methods=["PUT"])
def update_account():
    data = request.get_json()

    account = Account.find_account(data['username'], data['password'])
    if account is None:
        abort(401, "invalid account credentials")

    new_details = data['new_details']
    return jsonify(account.update(**new_details).to_dict())


@bp.route("/", methods=["DELETE"])
def delete_account():
    data = request.get_json()

    account = Account.find_account(data['username'], data['password'])
    if account is None:
        abort(401, "invalid account credentials")

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
