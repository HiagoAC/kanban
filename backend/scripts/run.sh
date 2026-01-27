#!/bin/sh

set -e

if [ "$DEV" != "false" ]; then
    exit 0
fi

python manage.py wait_for_db
python manage.py collectstatic --noinput
python manage.py migrate
python manage.py check --deploy

gunicorn app.wsgi:application --bind 0.0.0.0:8000
