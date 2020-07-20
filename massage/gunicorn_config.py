command = '/home/mark/irina-massage.ru/env/bin/gunicorn'
pythonpath = '/home/mark/irina-massage.ru/massage'
bind = '127.0.0.1:8065'
workers = 3
user = 'mark'
limit_request_fields = 32000
limit_request_lield = 0
raw_env = 'DJANGO_SETTINGS_MODULE=massage.settings'
