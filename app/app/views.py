from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy.exc import DBAPIError
from .models import DBSession, PathAndRow_Model, SceneList_Model
from sqs import *
import os


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
    s = os.environ['AWS_ACCESS_KEY_ID'],
    conn = make_connection(aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                           aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'])
    jobs_queue = get_queue('landsat_jobs_queue', conn)
    message = build_job_message(job_id=1, email='test@test.com',
                                scene_id=request.matchdict['scene_id'],
                                band_1=4, band_2=3, band_3=2)
    enqueue_message(message, jobs_queue)
    return None


@view_config(route_name='update', renderer='json')
def update(request):
    '''Accept a post request.'''
    return {'data': data}
