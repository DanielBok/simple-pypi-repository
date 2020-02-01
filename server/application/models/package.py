from hashlib import sha256
from os import getenv
from random import random
from typing import Optional

from application.extensions import db
from ._mixins import ResourceMixin

secret_key = getenv("SECRET_KEY", "default-secret-key-which").encode()


class Package(ResourceMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, index=True, nullable=False)
    allow_override = db.Column(db.Boolean, nullable=False)
    private = db.Column(db.Boolean, nullable=False)

    account_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False)
    locks = db.relationship('PackageLock', backref='package', lazy='joined', cascade='all,delete,delete-orphan')

    def __init__(self, name: str, allow_override: bool, private: bool):
        self.name = name.lower()
        self.allow_override = allow_override
        self.private = private

    @classmethod
    def find_by_name(cls, name: str) -> "Package":
        return cls.query.filter_by(name=name.lower()).one_or_none()

    def is_valid_token(self, token: str):
        for lock in self.locks:  # type: PackageLock
            if lock.token == token:
                return True
        return False

    def add_package_lock(self, description: str):
        token = sha256(random().hex().encode()).hexdigest()[:40]
        lock = PackageLock(token, description)
        self.locks.append(lock)
        self.save()

        return lock

    def update(self, allow_override: bool, private: bool):
        self.allow_override = allow_override
        self.private = private
        self.save()
        return self

    def to_dict(self, show_tokens: bool = False):
        out = {
            "name": self.name,
            "allow_override": self.allow_override,
            "private": self.private,
        }

        if self.private and show_tokens:
            out['locks'] = [l.to_dict() for l in self.locks]

        return out

    def __repr__(self):
        return f"<Package name='{self.name}' allow_override={self.allow_override} private={self.private}"


class PackageLock(ResourceMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(40), nullable=False)
    description = db.Column(db.String(255))
    package_id = db.Column(db.Integer, db.ForeignKey('package.id'))

    def __init__(self, token: str, description: str):
        self.token = token
        self.description = description.strip()

    @classmethod
    def find_by_id(cls, id: int) -> Optional["PackageLock"]:
        return cls.query.filter_by(id=id).one_or_none()

    def to_dict(self):
        return {
            "id": self.id,
            "token": self.token,
            "description": self.description,
            "package_id": self.package_id
        }
