'''Use this for production'''

from .base import *

DEBUG = False
ALLOWED_HOSTS += ['localhost','127.0.0.1','assignment-app-josh.herokuapp.com','www.assignment-app-josh.herokuapp.com']
WSGI_APPLICATION = 'assignmentApp.wsgi.prod.application'



STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
