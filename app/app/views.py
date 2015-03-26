from pyramid.view import view_config
from .models import PathAndRow_Model, SceneList_Model, UserJob_Model
from sqs import make_connection, get_queue, build_job_message, send_message
import os
from json import dumps
import operator

AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
JOBS_QUEUE = 'landsat_jobs_queue'
REGION = 'us-west-2'


def to_json(model):
    """ Returns a JSON representation of an SQLAlchemy-backed object.
    """
    json = {}
    json['fields'] = {}
    json['pk'] = getattr(model, 'id')

    for col in model._sa_class_manager.mapper.mapped_table.columns:
        json['fields'][col.name] = getattr(model, col.name)

    return dumps([json])


@view_config(route_name='index', renderer='templates/index.jinja2')
def index(request):
    '''Index page.'''
    return scene_options_ajax(request)


@view_config(route_name='request_scene', renderer='json')
def request_scene(request):
    '''Make request for scene, add to queue, add to db.'''
    SQSconn = make_connection(REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
    jobs_queue = get_queue(SQSconn, JOBS_QUEUE)
    pk = UserJob_Model.new_job(entityid=request.matchdict['scene_id'],
                                band1=request.params.get('band_combo')[0],
                                band2=request.params.get('band_combo')[1],
                                band3=request.params.get('band_combo')[2]
                                )
    message = build_job_message(job_id=pk, email='test@test.com',
                                scene_id=request.matchdict['scene_id'],
                                band_1=request.params.get('band_combo')[0],
                                band_2=request.params.get('band_combo')[1],
                                band_3=request.params.get('band_combo')[2]
                                )
    send_message(SQSconn, jobs_queue, message['body'], message['attributes'])
    return UserJob_Model.job_status(pk)


# @view_config(route_name='scene_status', renderer='templates/status.jinja2')
# def scene_status(request):
#     '''Given sceneID display available previews and rendered photos/links.'''
#     status = {}
#     # available_scenes = XXXXXXX.available(scene=request.matchdict['scene_id'])
#     for scene in available_scenes:
#         if scene.currentlyrend:
#             status[scene] = UserJob_Model.job_status(scene.jobid)

#     currently_rendering = XXXXXXX.currentlyrend(scene=request.matchdict['scene_id'])
#     return {'band_combo': available_scenes, 'status': status}


@view_config(route_name='done', renderer='json')
def done(request):
    '''Given post request from worker, in db, update job status.'''
    pk = request.params.get('job_id')
    status = request.params.get('status')
    UserJob_Model.set_job_status(pk, status)


@view_config(route_name='ajax', renderer='json')
def scene_options_ajax(request):
    """View for ajax request returns dict with all available scenes centered on
       map."""
    lat = float(request.params.get('lat', 47.614848))
    lng = float(request.params.get('lng', -122.3359059))

    scenes = SceneList_Model.scenelist(PathAndRow_Model.pathandrow(lat, lng))

    scenes_dict = []
    for i, scene in enumerate(scenes):
        scenes_dict.append({'acquisitiondate': scene.acquisitiondate.strftime('%Y %B %d'),
                            'cloudcover': scene.cloudcover,
                            'download_url': scene.download_url,
                            'entityid': scene.entityid,
                            'path': scene.path,
                            'row': scene.row})

    scenes_dict.sort(key=operator.itemgetter('acquisitiondate'), reverse=True)

    return {'scenes': scenes_dict,
            'lat': lat,
            'lng': lng}
