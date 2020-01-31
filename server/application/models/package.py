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
    locks = db.relationship('PackageLock', backref='package', lazy='select', cascade='all,delete,delete-orphan')

    def __init__(self, name: str, allow_override: bool, private: bool):
        self.name = name.lower()
        self.allow_override = allow_override
        self.private = private

    @classmethod
    def find_by_name(cls, name: str) -> "Package":
        return cls.query.filter_by(name=name.lower()).one_or_none()

    def add_package_lock(self):
        lock = PackageLock.new()
        self.locks.append(lock)
        self.save()

    def update(self, allow_override: bool, private: bool):
        self.allow_override = allow_override
        self.private = private
        self.save()
        return self

    def to_dict(self, show_tokens):
        out = {
            "name": self.name,
            "allow_override": self.allow_override,
            "private": self.private,
        }

        if self.private and show_tokens:
            out['tokens'] = [self.locks]

        return out


class PackageLock(ResourceMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(40), nullable=False)
    description = db.Column(db.String(255))
    package_id = db.Column(db.Integer, db.ForeignKey('package.id'))

    def __init__(self, token: str, description=""):
        self.token = token
        self.description = description.strip()

    @classmethod
    def new(cls, description=""):
        token = sha256(random().hex().encode()).hexdigest()[:40]
        return cls(token, description)

    @classmethod
    def find_by_id(cls, id: int) -> Optional["PackageLock"]:
        return cls.query.filter_by(id=id).one_or_none()
