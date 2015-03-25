import os
from pyramid.config import Configurator
from sqlalchemy import engine_from_config

from .models import DBSession, Base


def main(global_config, **settings):
    '''This function returns a Pyramid WSGI application.'''
    settings['sqlalchemy.url'] = os.environ.get('DATABASE_URL')
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('index', '/')
    config.add_route('scene', '/scene/{scene_id}/{b1}/{b2}/{b3}')
    config.add_route('done', '/done')
    config.scan()
    return config.make_wsgi_app()
