import os
import sys

apache_conf = os.path.dirname(__file__)
project = os.path.dirname(apache_conf)
workspace = os.path.dirname(project)
sys.path.append(workspace)
os.environ['DJANGO_SETTINGS_MODULE'] = 'coggene.settings'
os.environ['PYTHON_EGG_CACHE'] = '/home/www/django/coggene/apache/pythonEggCache'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()

