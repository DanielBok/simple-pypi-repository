import os
import time
from typing import Optional

import docker
import requests
from docker.models.containers import Container

from .exceptions import FixtureNeverReadyException, MissingExtensionException


class PostgresImage:
    _image_name = "postgres"
    _env_var = {}

    def __init__(self, host: str = 'localhost', port: int = 5432, password: str = "password",
                 database: str = 'db', schema: str = None, image_version="12-alpine", name="db",
                 alembic_config: str = None):
        self._host = host.strip()
        self._port = int(port)
        self._user = 'user'
        self._password = password
        self._database = database
        self._schema = schema
        self._version = image_version
        self._name = f"pytest-{name}"
        self._container: Optional[Container] = None

        self._client = docker.from_env()
        self._alembic_config = alembic_config
        self._ready = False

    @property
    def connection_details(self):
        return "postgresql+psycopg2://%s:%s@%s/%s?port=%d" % \
               (self._user, self._password, self._host, self._database, self._port)

    @property
    def has_docker(self):
        try:
            self._client.version()
            return True
        except requests.ConnectionError:
            return False

    @property
    def image(self):
        return f"{self._image_name}:{self._version}"

    @property
    def ready(self):
        return self.ready

    def set_env(self, *args: str, **kwargs):
        for arg in args:
            key, *values = arg.split("=")
            value = '='.join(values)
            kwargs[key] = value

        self._env_var = {
            **self._env_var,
            **kwargs,
        }

    def run(self):
        if not self.has_docker:
            return
        self._remove_container_if_exists()

        self._container = self._client.containers.run(self.image,
                                                      environment={
                                                          **self._env_var,
                                                          "POSTGRES_PASSWORD": self._password,
                                                          "POSTGRES_USER": self._user,
                                                          "POSTGRES_DB": self._database
                                                      },
                                                      ports={5432: self._port},
                                                      name=self._name,
                                                      detach=True)
        try:
            self._setup()
            self._ready = True
        except Exception as e:
            print(e)

    def _setup(self):
        from sqlalchemy.engine import create_engine
        max_tries = 60
        engine = create_engine(self.connection_details)

        for t in range(max_tries):
            try:
                with engine.connect() as con:
                    rows = con.execute('SELECT 1').first()
                    if rows[0] != 1:
                        time.sleep(0.5)
                        continue

                    if isinstance(self._alembic_config, str):
                        self._apply_migrations(con)
                    return

            except Exception as e:
                if t == max_tries - 1:
                    print(e)
                time.sleep(0.5)

        # failed
        self.close()
        raise FixtureNeverReadyException()

    def _apply_migrations(self, con):
        try:
            from alembic import command
            from alembic.config import Config
        except ImportError:
            raise MissingExtensionException("Please install alembic to apply migrations")

        if not os.path.exists(self._alembic_config) or os.path.split(self._alembic_config)[-1] != "alembic.ini":
            raise FileNotFoundError(f"Could not find alembic.ini config file at {self._alembic_config}")

        cfg = Config(self._alembic_config)

        # full path
        script_location = os.path.dirname(self._alembic_config)
        cfg.set_main_option("script_location", script_location)
        cfg.set_main_option('sqlalchemy.url', self.connection_details)
        cfg.attributes['connection'] = con

        command.upgrade(cfg, "head")

    def _remove_container_if_exists(self):
        containers = self._client.containers.list(all=True)
        for c in containers:  # type: Container
            if c.name == self._name:
                if c.status == "running":
                    c.kill()
                c.remove()

    def close(self):
        if isinstance(self._container, Container):
            self._container.kill()
            self._container.remove()
        self._client.close()
