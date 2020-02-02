import pytest
from sqlalchemy.exc import IntegrityError

from application.models import Account, Package, PackageLock

user1 = Account("test_user1", "password", "user1@gmail.com")
user2 = Account("test_user2", "password", "user2@gmail.com")
pkg1 = Package("package1", False, False)
pkg2 = Package("package2", False, True)


def test_create_account(db_session):
    user1.save()
    user2.save()

    assert user1.to_dict() == {"username": user1.username, "email": user1.email}
    assert user2.to_dict() == {"username": user2.username, "email": user2.email}


@pytest.mark.parametrize("username, password, email, exc", [
    ("test_user1", "password", "new_email@gmail.com", IntegrityError),
    ("test_user3", "password", "user1@gmail.com", IntegrityError),
    ("", "password", "user3@gmail.com", ValueError),
    ("test_user3", "", "user3@gmail.com", ValueError),
    ("test_user3", "password", "", ValueError),
    ("test_user3", "password", "not-an-email", ValueError),
])
def test_create_with_invalid_values_raises_exceptions(db_session, username, password, email, exc):
    with pytest.raises(exc):
        Account(username, password, email).save()


@pytest.mark.parametrize("username_or_email, password, is_none", [
    (user1.username, "password", False),
    (user1.email, "password", False),
    (user1.email, "bad-password", True),
    ("user3", user1.password, True),
])
def test_find_account(db_session, username_or_email, password, is_none):
    account = Account.find_account(username_or_email, password)
    if is_none:
        assert account is None
    else:
        assert account is not None


def test_update_account(db_session):
    account = Account.find_account(user2.email, "password")
    assert account is not None

    account.update("user3", "password", "user3@gmail.com")
    assert Account.find_account("user3", "password") is not None


def test_create_package(db_session):
    account = Account.find_account(user1.email, "password")
    account.packages.append(pkg1)
    account.packages.append(pkg2)
    account.save()

    account = Account.find_account(user1.email, "password")
    assert len(account.to_dict(True)['packages']) == 2


@pytest.mark.parametrize("name, is_none", [
    (pkg1.name, False),
    ("bad-name", True),
])
def test_find_package(db_session, name, is_none):
    pkg = Package.find_by_name(name)
    if is_none:
        assert pkg is None
    else:
        assert pkg is not None


def test_update_package(db_session):
    pkg = Package.find_by_name(pkg1.name)
    pkg.update(allow_override=True, private=True)

    assert pkg.to_dict() == {"name": pkg1.name, "allow_override": True, "private": True}


def test_add_lock():
    pkg = Package.find_by_name(pkg1.name)
    pkg.add_package_lock("random description for token")

    assert len(pkg.to_dict(True)["locks"]) == 1


def test_delete_package_cascades(db_session):
    pkg = Package.find_by_name(pkg1.name)
    pkg.delete()

    assert len(PackageLock.query.all()) == 0, "all package locks should have been removed"


def test_delete_account_cascades(db_session):
    for account in Account.query:
        account.delete()

    assert len(PackageLock.query.all()) == 0, "all package locks should have been removed"
    assert len(Package.query.all()) == 0, "all package should have been removed"
