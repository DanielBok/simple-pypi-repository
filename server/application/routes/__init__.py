from flask import Flask

from .packages.routes import bp as pkg_routes
from .accounts.routes import bp as act_routes


def register_routes(app: Flask):
    app.register_blueprint(pkg_routes, url_prefix="/simple")
    app.register_blueprint(act_routes, url_prefix="/api/account")
