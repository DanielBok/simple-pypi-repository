from flask import Flask

from .packages.routes import bp as pkg_routes


def register_routes(app: Flask):
    app.register_blueprint(pkg_routes, url_prefix="/simple")
