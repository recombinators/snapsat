from pyramid.view import view_config
from .models import PathAndRow_Model, SceneList_Model
from sqs import make_connection, get_queue, build_job_message, send_message
import os

AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
JOBS_QUEUE = 'landsat_jobs_queue'
REGION = 'us-west-2'


@view_config(route_name='index', renderer='templates/index.jinja2')
def index(request):
    '''Index page.'''
    lat = float(request.params.get('lat', 47.614848))
    lng = float(request.params.get('lng', -122.3359059))
    scenes = SceneList_Model.scenelist(PathAndRow_Model.pathandrow(lat, lng))
    return {'scenes': scenes}


@view_config(route_name='scene', renderer='json')
def scene(request):
    SQSconn = make_connection(REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
    jobs_queue = get_queue(SQSconn, JOBS_QUEUE)
    message = build_job_message(job_id=1, email='test@test.com',
                                scene_id=request.matchdict['scene_id'],
                                band_1=4, band_2=3, band_3=2)
    send_message(SQSconn, jobs_queue, message['body'], message['attributes'])
    return None
