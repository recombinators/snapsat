from pyramid.view import view_config
from .models import (PathAndRow_Model, SceneList_Model, UserJob_Model,
                     Rendered_Model,)
from sqs import (make_SQS_connection, get_queue, build_job_message,
                 send_message, queue_size,)
from foreman import (foreman, make_EC2_connection,)
import os
from pyramid.httpexceptions import HTTPFound
import operator

AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
JOBS_QUEUE = 'landsat_jobs_queue'
REGION = 'us-west-2'


@view_config(route_name='index', renderer='templates/index.jinja2')
def index(request):
    '''Index page.'''
    return scene_options_ajax(request)


@view_config(route_name='request_scene', renderer='json')
def request_scene(request):
    '''Make request for scene, add to queue, add to db.'''
    EC2conn = make_EC2_connection(REGION,
                                  AWS_ACCESS_KEY_ID,
                                  AWS_SECRET_ACCESS_KEY)
    # foreman(EC2conn, REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
    band1 = request.params.get('band_combo')[0]
    band2 = request.params.get('band_combo')[1]
    band3 = request.params.get('band_combo')[2]
    scene_id = request.matchdict['scene_id']
    if not Rendered_Model.already_available(scene_id, band1, band2, band3):
        SQSconn = make_SQS_connection(REGION,
                                      AWS_ACCESS_KEY_ID,
                                      AWS_SECRET_ACCESS_KEY)
        jobs_queue = get_queue(SQSconn, JOBS_QUEUE)
        pk = UserJob_Model.new_job(entityid=scene_id,
                                   band1=band1,
                                   band2=band2,
                                   band3=band3)
        message = build_job_message(job_id=pk, email='test@test.com',
                                    scene_id=scene_id,
                                    band_1=band1,
                                    band_2=band2,
                                    band_3=band3)
        send_message(SQSconn,
                     jobs_queue,
                     message['body'],
                     message['attributes'])
    return HTTPFound(location='/scene/{}'.format(scene_id))


@view_config(route_name='scene_status', renderer='templates/scene.jinja2')
def scene_status(request):
    '''Given sceneID display available previews and rendered photos/links.'''
    status = {}
    available_scenes = Rendered_Model.available(request.matchdict['scene_id'])
    for scene in available_scenes:
        if scene.currentlyrend:
            status[scene.jobid] = UserJob_Model.job_status(scene.jobid)
    return {'scene_id': request.matchdict['scene_id'],
            'available_scenes': available_scenes, 'status': status}


@view_config(route_name='done', renderer='json')
def done(request):
    '''Given post request from worker, in db, update job status.'''
    pk = request.params.get('job_id')
    status = request.params.get('status')
    url = request.params.get('url')
    UserJob_Model.set_job_status(pk, status, url)


def preview_url(scene, band1, band2, band3):
    '''get link for preview url'''
    root = 'ec2-52-11-232-129.us-west-2.compute.amazonaws.com'
    # root = 'localhost:6543'
    url = 'http://{}/{}/{}/{}/{}/preview.png'.format(root, scene, band1, band2, band3)
    return url


@view_config(route_name='ajax', renderer='json')
def scene_options_ajax(request):
    """View for ajax request returns dict with all available scenes centered on
       map."""
    lat = float(request.params.get('lat', 47.614848))
    lng = float(request.params.get('lng', -122.3359059))

    scenes = SceneList_Model.scenelist(PathAndRow_Model.pathandrow(lat, lng))

    scenes_dict = []
    for i, scene in enumerate(scenes):
        normal = preview_url(scene.entityid, 4, 3, 2)
        heat = preview_url(scene.entityid, 5, 4, 3)
        veggie = preview_url(scene.entityid, 5, 3, 2)
        scenes_dict.append({'acquisitiondate': scene.acquisitiondate.strftime('%Y %B %d'),
                            'cloudcover': scene.cloudcover,
                            'download_url': scene.download_url,
                            'entityid': scene.entityid,
                            'path': scene.path,
                            'row': scene.row,
                            'normal': normal,
                            'heat': heat,
                            'veggie': veggie
                            })

    scenes_dict.sort(key=operator.itemgetter('acquisitiondate'), reverse=True)

    return {'scenes': scenes_dict}
