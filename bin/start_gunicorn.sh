#!/bin/bash
source /home/mark/irina-massage.ru/env/bin/activate
exec gunicorn -c "/home/mark/irina-massage.ru/massage/gunicorn_config.py" massage.wsgi
