from flask import Flask

from .accounts.api import bp as act_api
from .packages.api import bp as pkg_api
from .packages.routes import bp as pkg_routes
from .projects.api import bp as prj_api


def register_routes(app: Flask):
    app.register_blueprint(pkg_routes, url_prefix="/simple")
    app.register_blueprint(act_api, url_prefix="/api/account")
    app.register_blueprint(pkg_api, url_prefix='/api/package')
    app.register_blueprint(prj_api, url_prefix='/api/project')
