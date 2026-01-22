#!/bin/sh

set -e

python manage.py wait_for_db
python manage.py collectstatic --noinput
python manage.py migrate

gunicorn app.wsgi:application --bind 0.0.0.0:$PORT
