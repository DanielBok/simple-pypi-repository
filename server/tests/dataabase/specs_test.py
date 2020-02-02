from application.models import Account

username, password, email = "test_user", "password", "test-email@gmail.com"


def test_create_account(db_session):
    account = Account(username, password, email)
    account.save()

    assert account.to_dict() == {"username": username, "email": email}
