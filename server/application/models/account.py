import os
import re
from hashlib import sha256
from typing import Optional

from sqlalchemy import func

from application.extensions import db
from ._mixins import ResourceMixin

secret_key = os.getenv("SECRET_KEY", "default-secret-key-which").encode()


class Account(ResourceMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False, index=True, unique=True)
    password = db.Column(db.String(100))
    allow_overrides = db.Column(db.Boolean, default=False)
    email = db.Column(db.String(512), nullable=False, index=True, unique=True)

    def __init__(self, username: str, password: str, allow_overrides: bool, email: str):
        self.username = username
        self.password = password
        self.allow_overrides = allow_overrides
        self.email = email

        self.validate()

    @staticmethod
    def encrypt(password: str) -> str:
        return sha256(password.encode() + secret_key).hexdigest()

    @classmethod
    def find_account(cls, username_or_email: str, password: Optional[str] = None) -> Optional["Account"]:
        username_or_email = username_or_email.lower()
        account = cls.query \
            .filter((func.lower(cls.username) == username_or_email) |
                    (func.lower(cls.email) == username_or_email)) \
            .one_or_none()

        if account is None or password is None:
            return account

        if not account.validate_password(password):
            return None

        return account

    def validate(self):
        self.username = self.username.strip()
        self.password = self.password.strip()
        self.email = self.email.strip()
        if self.username == "":
            raise ValueError("username cannot be empty")

        if self.password == "":
            raise ValueError("password cannot be empty")
        else:
            self.password = self.encrypt(self.password)

        if re.match(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", self.email) is None:
            raise ValueError(f"email address '{self.email}' is not valid")

    def validate_password(self, password: str):
        return self.password == self.encrypt(password)

    def update(self, username: str, password: str, allow_overrides: bool, email: str):
        self.username = username
        self.password = password
        self.allow_overrides = allow_overrides
        self.email = email

        self.validate()
        self.save()
        return self

    def to_dict(self):
        return {
            "username": self.username,
            "allow_overrides": self.allow_overrides,
            "email": self.email,
        }
