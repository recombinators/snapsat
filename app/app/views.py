from pyramid.view import view_config


@view_config(route_name='index', renderer='templates/index.jinja2')
def index(request):
    '''Index page.'''
    return {}


@view_config(route_name='submit', renderer='json')
def submit(request):
    '''Accept a post request.'''
    return {}
