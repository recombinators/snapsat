import os
from pyramid.config import Configurator
from sqlalchemy import engine_from_config

# import models defined in [[models.py]]
from .models import DBSession, Base


def main(global_config, **settings):
    """
    Returns a WSGI application with the following routes:

    1. **Index** - The main view - [[views.py#index]]
    3. **Done** - Updates job status - [[views.py#done]]
    5. **Ajax** - Returns a dict with available scenes - [[views.py#ajax]]
    2. **Request scene** - Add a request to the queue - [[views.py#request]]
    4. **Scene status** - Display scene metadata - [[views.py#scene_status]]
    """

    # SQLAlchemy configuration
    settings['sqlalchemy.url'] = os.environ.get('DATABASE_URL')
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine

    # Import settings from development/production.ini
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.add_static_view('static', 'static', cache_max_age=3600)

    # Define routes
    config.add_route('index', '/')
    config.add_route('done', '/done')
    config.add_route('ajax', '/ajax')
    config.add_route('request_scene', '/request/{scene_id}')
    config.add_route('scene_status', '/scene/{scene_id}')
    config.scan()

    # Return a WSGI application
    return config.make_wsgi_app()
