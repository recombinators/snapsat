import os
from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from .models import DBSession, Base


def main(global_config, **settings):
    """
    Configure and return a WSGI application.
    """
    settings['sqlalchemy.url'] = os.environ.get('DATABASE_URL')
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.add_static_view('static', 'static', cache_max_age=3600)

    # Define routes
    config.add_route('landing', '/')
    config.add_route('create', '/create')
    config.add_route('request_scene', '/request/{scene_id}')
    config.add_route('request_preview', '/request_p/{scene_id}')
    config.add_route('scene_status', '/scene/{scene_id}')
    config.add_route('ajax', '/ajax')

    config.scan()
    return config.make_wsgi_app()
