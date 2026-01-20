#!/bin/sh

set -e

python manage.py wait_for_db
python manage.py migrate

uwsgi --http :$PORT --module app.wsgi --workers 1 --enable-threads --master
