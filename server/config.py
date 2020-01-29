import os
import platform

static_folder = r'C:\temp\pypi-server' if platform.system() == 'Windows' else '/var/pypi-server'
package_folder = os.path.join(static_folder, 'packages')


class Config(object):
    DEBUG = True
    DEBUG_TB_INTERCEPT_REDIRECTS = False
    SECRET_KEY = os.urandom(128).hex()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(
        user=os.getenv("POSTGRES_USER", 'postgres'),
        pw=os.getenv("POSTGRES_PASSWORD", 'postgres'),
        url=os.getenv("POSTGRES_PASSWORD", 'localhost:5432'),
        db=os.getenv("POSTGRES_DB", 'postgres'),
    )

    TIMEZONE = 'Asia/Singapore'
    STATIC_FOLDER = static_folder
    PACKAGE_FOLDER = package_folder
    NUM_PROCESSORS = max(os.cpu_count() - 2, 1)
