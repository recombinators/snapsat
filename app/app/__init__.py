import os
from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from .models import Session, Base


def main(global_config, **settings):
    """
    Configure and return a WSGI application.
    """
    settings['sqlalchemy.url'] = os.environ.get('DATABASE_URL')
    engine = engine_from_config(settings, 'sqlalchemy.')
    Session.configure(bind=engine)
    Base.metadata.bind = engine
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.add_static_view('static', 'static', cache_max_age=3600)

    # Define routes
    config.add_route('index', '/')
    config.add_route('about', 'about/')
    config.add_route('hire', 'hire/')
    config.add_route('guide', 'guide/')
    config.add_route('request', 'request/{rendertype}/{scene_id}/')
    config.add_route('scene', 'scene/{scene_id}/')
    config.add_route('scene_band', 'scene/{scene_id}/bands/{band_combo}/')
    config.add_route('scene_options_ajax', 'scene_options_ajax/')
    config.add_route('status_poll', 'status_poll/')
    config.add_route('preview_poll', 'preview_poll/')
    config.scan()
    return config.make_wsgi_app()
