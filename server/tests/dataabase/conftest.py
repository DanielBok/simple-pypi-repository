from pathlib import Path

import pytest
from flask import Flask

from application.extensions import db, migrate
from tests.images import PostgresImage

root_dir = Path(__file__).parent.parent.parent


@pytest.fixture(scope="package")
def app():
    """
    Creates a Postgres database and Flask app context for the tests and
    drops the database when all tests are done
    """
    client = Flask(__name__)
    postgres = PostgresImage(
        port=55432,
        alembic_config=root_dir.joinpath("migrations", "alembic.ini").as_posix()
    )
    client.config['SQLALCHEMY_DATABASE_URI'] = postgres.connection_details

    with client.app_context():
        # initial run requires the SQLAlchemy and migration instance to be initialized as these objects
        # will be used to migrate the database in the postgres.run() method
        db.init_app(client)
        migrate.init_app(client, db)
        postgres.run()

    yield client
    postgres.close()


@pytest.fixture
def db_session(app):
    """
    Provide the transactional fixtures with access to the database via a Flask-SQLAlchemy
    database connection.
    """
    with app.app_context() as ctx:
        ctx.push()
        return db.init_app(app)
