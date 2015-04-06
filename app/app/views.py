from models import (Paths_Model, PathRow_Model, UserJob_Model,
                     RenderCache_Model,)
import os
import operator
import itertools
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound
from datetime import datetime
from sqs import (make_SQS_connection, get_queue, build_job_message,
                 send_message,)

# Define AWS credentials
AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
REGION = 'us-west-2'

# Requests are passed into appropriate queues, as defined here.

COMPOSITE_QUEUE = 'snapsat_composite_queue'
PREVIEW_QUEUE = 'snapsat_preview_queue'


"""
Helper functions:
1. add_to_queue - Adds a request to the appropriate queue.

Views available:
1. landing - Landing page.
2. create - Allow a user to define their area of interest.
3. request_scene - Requests both the full and preview renders.
4. request_preview - Requests just the preview render.
5. scene_status - Given a scene ID display available data.
6. ajax - Returns a dictionary with all available scenes.
"""


@view_config(route_name='landing', renderer='templates/landing.jinja2')
def landing(request):
    """
    Landing page.
    No context is passed in, the page is purely static.
    """
    return {}


@view_config(route_name='create', renderer='templates/create.jinja2')
def create(request):
    """
    Create page.
    Allows a user to define their area of interest and receive appropriate
    lists of scenes for it.
    """
    return scene_options_ajax(request)


def add_to_queue_composite(request):
    """
    Helper method for adding request to queue and adding to db.
    """
    # import ipdb; ipdb.set_trace()
    band1 = request.params.get('band_combo')[0]
    band2 = request.params.get('band_combo')[1]
    band3 = request.params.get('band_combo')[2]
    scene_id = request.matchdict['scene_id']

    if not RenderCache_Model.full_render_availability(scene_id,
                                                      band1,
                                                      band2,
                                                      band3):
        SQSconn = make_SQS_connection(REGION,
                                      AWS_ACCESS_KEY_ID,
                                      AWS_SECRET_ACCESS_KEY)
        current_queue = get_queue(SQSconn, COMPOSITE_QUEUE)
        jobid = UserJob_Model.new_job(entityid=scene_id,band1=band1,band2=band2,band3=band3,rendertype=u'composite')
        # import ipdb; ipdb.set_trace()
        message = build_job_message(job_id=jobid, email='test@test.com',
                                    scene_id=scene_id,
                                    band_1=band1,
                                    band_2=band2,
                                    band_3=band3)
        send_message(SQSconn,
                     current_queue,
                     message['body'],
                     message['attributes'])


def add_to_queue_preview(request):
    """
    Helper method for adding request to queue and adding to db.
    """
    band1 = request.params.get('band_combo')[0]
    band2 = request.params.get('band_combo')[1]
    band3 = request.params.get('band_combo')[2]
    scene_id = request.matchdict['scene_id']
    if not RenderCache_Model.preview_render_availability(scene_id,
                                                         band1,
                                                         band2,
                                                         band3):
        SQSconn = make_SQS_connection(REGION,
                                      AWS_ACCESS_KEY_ID,
                                      AWS_SECRET_ACCESS_KEY)
        current_queue = get_queue(SQSconn, PREVIEW_QUEUE)
        jobid = UserJob_Model.new_job(entityid=scene_id,
                                      band1=band1,
                                      band2=band2,
                                      band3=band3,
                                      rendertype=u'preview')
        message = build_job_message(job_id=jobid, email='test@test.com',
                                    scene_id=scene_id,
                                    band_1=band1,
                                    band_2=band2,
                                    band_3=band3)
        send_message(SQSconn,
                     current_queue,
                     message['body'],
                     message['attributes'])
        print 'successfully added to preview queue'


@view_config(route_name='request_composite', renderer='json')
def request_composite(request):
    """
    Request scene full render and preview render.
    """
    add_to_queue_composite(request)
    add_to_queue_preview(request)
    return HTTPFound(location='/scene/{}'.format(request.matchdict['scene_id']))


@view_config(route_name='request_preview', renderer='json')
def request_preview(request):
    """
    Request for preview only
    """
    add_to_queue_preview(request)
    return HTTPFound(location='/scene/{}'.format(
        request.matchdict['scene_id']))


@view_config(route_name='scene', renderer='templates/scene.jinja2')
def scene(request):
    """
    Given sceneID display available previews, rendered photos/links, status of
    jobs in process.
    """

    scene_id = request.matchdict['scene_id']
    rendered_rendering_composites = RenderCache_Model.get_rendered_rendering(
        scene_id)
    rendered_composites = []
    rendering_composites = {}
    # import ipdb; ipdb.set_trace()
    if rendered_rendering_composites:
        for composite in rendered_rendering_composites:
            if composite.currentlyrend:
                # import ipdb; ipdb.set_trace()
                job_status, start_time, last_modified = (UserJob_Model.job_status_and_times(composite.jobid))
                elapsed_time = str(datetime.utcnow() - start_time)
                rendering_composites[
                    composite.jobid] = ({'status': job_status,
                                         'starttime': start_time,
                                         'lastmodified': last_modified,
                                         'elapsedtime': elapsed_time,
                                         'band1': composite.band1,
                                         'band2': composite.band2,
                                         'band3': composite.band3})
            else:
                rendered_composites.append(composite)


    # for scene in rendered_composites:
    #     if scene.currentlyrend or scene.renderurl:
    #         worker_start_time, worker_lastmod_time = (
    #             UserJob_Model.job_times(scene.jobid))
    #         if scene.currentlyrend:
    #             status[scene.jobid] = UserJob_Model.job_status(scene.jobid)
    #             elapsed_time = str(datetime.utcnow() - worker_start_time)
    #         else:
    #             elapsed_time = str(worker_lastmod_time - worker_start_time)
    #         # format datetime object
    #         elapsed_time = ':'.join(elapsed_time.split(':')[1:3])
    #         scene.elapsed_worker_time = elapsed_time.split('.')[0]

    return {'scene_id': scene_id,
            'rendered_composites': rendered_composites,
            'rendering_composites': rendering_composites,
            }


@view_config(route_name='scene_options_ajax', renderer='json')
def scene_options_ajax(request):
    """
    Returns a dictionary with all available scenes around the map's center.
    """
    lat = float(request.params.get('lat', 47.614848))
    lng = float(request.params.get('lng', -122.3359059))

    scenes = PathRow_Model.scenelist(Paths_Model.pathandrow(lat, lng))
    scenes_dict = []
    for i, scene in enumerate(scenes):
        scenes_dict.append({'acquisitiondate': scene.acquisitiondate.strftime('%Y %m %d'),
                            'cloudcover': scene.cloudcover,
                            'download_url': scene.download_url,
                            'entityid': scene.entityid,
                            'sliced': scene.entityid[3:9],
                            'path': scene.path,
                            'row': scene.row
                            })

    scenes_date = sorted(scenes_dict,
                         key=operator.itemgetter('acquisitiondate'),
                         reverse=True)
    scenes_pr = sorted(scenes_dict,
                       key=operator.itemgetter('sliced'),
                       reverse=False)

    scenes_path_row = []
    for key, items in itertools.groupby(scenes_pr, operator.itemgetter('sliced')):
        scenes_path_row.append(list(items))

    return {'scenes_date': scenes_date,
            'scenes_path_row': scenes_path_row}


@view_config(route_name='status_poll', renderer='json')
def status_poll(request):
    """
    Poll database for render job status.
    """
    jobid = request.params.get('jobid')
    job_info = UserJob_Model.job_status_and_times(jobid)

    return {'job_info': job_info}
