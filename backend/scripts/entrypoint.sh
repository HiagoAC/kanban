#!/bin/sh
echo "Waiting for db..."
wait-for-it "$DB_HOST:$DB_PORT"
echo "DB is ready."
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
