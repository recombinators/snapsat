from pyramid.view import view_config


@view_config(route_name='index', renderer='templates/maint.jinja2')
def index(request):
    '''Index page.'''
    return {}
