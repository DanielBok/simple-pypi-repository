import multiprocessing
import os

# environment
flask_env = os.environ.get("FLASK_ENV", "production").lower()

# global variables

# Logging
accesslog = "-"
access_log_format = '''
%(h)s %(l)s %(u)s %(t)s %(r)s %(s)s 
response_length=%(b)s
referer=%(f)s
ser_agent=%(a)s
time_taken=%(L)ss
---------------------------------------------------------
'''.strip()
errorlog = "-"

# Server mechanics
worker_tmp_dir = "/dev/shm"

# Server socket
bind = "0.0.0.0:80"

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
timeout = 1200  # 20 minutes, pretty sure the longest running task will take less than 20 minutes

# environment specific variables
if flask_env == "production":
    loglevel = "info"
else:
    loglevel = "debug"

# SSL settings
if (cert_path := os.getenv("CERTFILE", "")) != "" and os.path.exists(cert_path):
    if (key_path := os.getenv("KEYFILE", "")) != "" and os.path.exists(key_path):
        certfile = cert_path
        keyfile = key_path
        bind = "0.0.0.0:443"
