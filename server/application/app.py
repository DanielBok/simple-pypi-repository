import logging
import os
from typing import Optional

from flask import Flask

from .extensions import cors, db, migrate
from .routes import register_routes


class AppFactory:
    def __init__(self, settings_overrides: dict = None):
        self._settings_overrides = settings_overrides
        self._app: Optional[Flask] = None

    def create_app(self):
        self._app = Flask(__name__, instance_relative_config=True)
        self._app.url_map.strict_slashes = False

        self._add_favicon_rule() \
            ._add_healthcheck() \
            ._add_logging_rules() \
            ._add_application_settings() \
            ._add_extensions() \
            ._add_routes()

        return self._app

    def _add_favicon_rule(self):
        # ignore favicon calls
        self._app.add_url_rule('/favicon.ico', view_func=lambda: ('', 204))
        return self

    def _add_healthcheck(self):
        self._app.add_url_rule('/healthcheck', endpoint='healthcheck', view_func=lambda: ('healthy', 200))
        return self

    def _add_logging_rules(self):
        if os.environ.get("GUNICORN", "0") != "0":
            # only write to GUNICORN when it is run with GUNICORN as the wsgi server
            logger = logging.getLogger("gunicorn.error")
            logger.setLevel(logging.DEBUG)
            self._app.logger.handlers = logger.handlers

        return self

    def _add_application_settings(self):
        self._app.config.from_object(f"config.Config")

        if isinstance(self._settings_overrides, dict):
            self._app.config.update(self._settings_overrides)

        return self

    def _add_extensions(self):
        cors.init_app(self._app)

        db.init_app(self._app)

        with self._app.app_context():
            if db.engine.url.drivername == 'sqlite':
                migrate.init_app(self._app, db, render_as_batch=True)
            else:
                migrate.init_app(self._app, db)

        return self

    def _add_routes(self):
        register_routes(self._app)
        return self
