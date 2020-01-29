from application import AppFactory

app = AppFactory().create_app()

if __name__ == '__main__':
    app.run('0.0.0.0', 9090, debug=True, passthrough_errors=True, threaded=True)
