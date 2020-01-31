from flask import Flask

from .accounts.routes import bp as act_routes
from .packages.api import bp as pkg_api_routes
from .packages.routes import bp as pkg_routes


def register_routes(app: Flask):
    app.register_blueprint(pkg_routes, url_prefix="/simple")
    app.register_blueprint(act_routes, url_prefix="/api/account")
    app.register_blueprint(pkg_api_routes, url_prefix='/api/package')
