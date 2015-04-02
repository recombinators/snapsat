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
    config.add_route('request_scene', '/request/{scene_id}')
    config.add_route('request_preview', '/request_p/{scene_id}')
    config.add_route('done', '/done')
    config.add_route('scene_page', '/scene/{scene_id}')
    config.add_route('scene_options_ajax', '/scene_options_ajax')
    config.add_route('status_poll', '/status_poll')
    config.scan()
    return config.make_wsgi_app()
