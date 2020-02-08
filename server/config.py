import os
import platform

static_folder = r'C:\temp\pypi-server' if platform.system() == 'Windows' else '/var/pypi-server'
package_folder = os.path.join(static_folder, 'packages')


class Config(object):
    DEBUG = True
    DEBUG_TB_INTERCEPT_REDIRECTS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-which-should-be-overwritten")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(
        user=os.getenv("POSTGRES_USER", 'user'),
        pw=os.getenv("POSTGRES_PASSWORD", 'password'),
        url=os.getenv("POSTGRES_HOST", 'localhost:5432'),
        db=os.getenv("POSTGRES_DB", 'db'),
    )

    TIMEZONE = 'Asia/Singapore'
    STATIC_FOLDER = static_folder
    PACKAGE_FOLDER = package_folder
    NUM_PROCESSORS = max(os.cpu_count() - 2, 1)
