from flask import abort, request

from application.models import Account


def get_account(abort_if_invalid=True, username="") -> Account:
    """Gets credentials from the header's 'Authorization' key"""

    if abort_if_invalid:
        if request.authorization is None:
            abort(403, "No credentials provided")

        username = request.authorization['username']
        password = request.authorization['password']
        if username == "" or password == "":
            abort(403, "No credentials provided. Please ensure you have a registered account")

        account = Account.find_account(username, password)
        if account is None:
            abort(403, "Invalid account credentials. Please ensure you have a valid registered account")
    else:
        account = Account.find_account(username)

    return account
