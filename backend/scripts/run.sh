#!/bin/sh

set -e

python manage.py wait_for_db
python manage.py migrate

gunicorn app.wsgi --bind 0.0.0.0:$PORT
