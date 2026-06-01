#!/bin/sh
set -e

gunicorn --bind 127.0.0.1:5000 --workers 1 --threads 2 --chdir /app app:app &
cd /app/web
exec node server.js
