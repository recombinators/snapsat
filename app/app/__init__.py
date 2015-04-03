from pyramid.config import Configurator


def main(global_config, **settings):
    '''This function returns a Pyramid WSGI application.'''
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('index', '/')
<<<<<<< HEAD
    config.add_route('request_scene', '/request/{scene_id}')
    config.add_route('request_preview', '/request_p/{scene_id}')
    config.add_route('done', '/done')
    config.add_route('scene_status', '/scene/{scene_id}')
    config.add_route('ajax', '/ajax')
=======
>>>>>>> static_down
    config.scan()
    return config.make_wsgi_app()
