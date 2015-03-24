from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy.exc import DBAPIError
from .models import DBSession, PathAndRow_Model, SceneList_Model


@view_config(route_name='index', renderer='templates/index.jinja2')
def index(request):
    '''Index page.'''
    lat = float(request.params.get('lat', 47.614848))
    lng = float(request.params.get('lng', -122.3359059))
    scenes = SceneList_Model.scenelist(PathAndRow_Model.pathandrow(lat, lng))
    return {'scenes': scenes}


@view_config(route_name='submit', renderer='json')
def submit(request):
    '''Accept a post request.'''
    return {}

@view_config(route_name='scene', renderer='json')
def scene(request):
    return {}
