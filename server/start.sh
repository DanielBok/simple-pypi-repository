#!/bin/bash

if [[ -z "$DEBUG" || "$DEBUG" == "0" ]]; then
  export GUNICORN=1
  gunicorn --config gunicorn.py app:app
else
  python app.py
fi
