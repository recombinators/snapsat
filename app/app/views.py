import os
import operator
import itertools
from datetime import datetime, timedelta
from models import Paths, PathRow, UserJob, RenderCache
from pyramid.view import view_config, notfound_view_config
from pyramid.httpexceptions import HTTPFound, HTTPNotFound
from sqs import make_SQS_connection, get_queue, build_job_message, send_message
from collections import OrderedDict
import pyramid.httpexceptions as exc
import time
from pyramid.request import Request

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


@notfound_view_config(append_slash=True)
def notfound(request):
    return HTTPNotFound('Not found, bro.')


@view_config(route_name='index', renderer='templates/index.jinja2')
def index(request):
    """
    Index page.
    Allows a user to define their area of interest and receive appropriate
    lists of scenes for it.
    """
    return {}


@view_config(route_name='about', renderer='templates/about.jinja2')
def about(request):
    """
    About page.
    Sheer beauty.
    """
    return {}


@view_config(route_name='hire', renderer='templates/hire.jinja2')
def hire(request):
    """
    Hire page.
    Give us the $$$
    """
    return {}


@view_config(route_name='guide', renderer='templates/guide.jinja2')
def guide(request):
    """
    Guide page.
    """
    return {}


@view_config(route_name='immediate', renderer='templates/immediate.jinja2')
def immediate(request):
    """
    Possible replacment for home page, which immediately renders a preview.
    """
    return {}


def add_to_queue(request, rendertype):
    """
    Helper method for adding request to queue and adding to db.
    """
    band1 = request.params.get('band1')
    band2 = request.params.get('band2')
    band3 = request.params.get('band3')
    scene_id = request.matchdict['scene_id']
    available = RenderCache.composite_availability(scene_id,
                                                   band1, band2, band3,
                                                   rendertype)

    if available:
        # if this scene/band has already been requested, increase the count
        return RenderCache.update_render_count(scene_id,
                                               band1, band2, band3,
                                               rendertype)

    if not available:
        SQSconn = make_SQS_connection(REGION,
                                      AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)

        if rendertype == u'preview':
            current_queue = get_queue(SQSconn, PREVIEW_QUEUE)
            email = None
        elif rendertype == u'full':
            current_queue = get_queue(SQSconn, COMPOSITE_QUEUE)
            email = request.params.get('email_address')

        jobid = UserJob.new_job(entityid=scene_id,
                                band1=band1, band2=band2, band3=band3,
                                rendertype=rendertype, email=email)

        message = build_job_message(job_id=jobid,
                                    scene_id=scene_id,
                                    band_1=band1, band_2=band2, band_3=band3)

        send_message(SQSconn,
                     current_queue,
                     message['body'], message['attributes'])
        return jobid


@view_config(route_name='request', renderer='json')
def request_composite(request):
    """Request apprpriate images for a particular composite.

    Redirect to scene page and go to band requested.
    If incorrect band combo is requested, bad request.

    If request contains email_address, send email to user with a link to the
    full render zip file.
    """

    # Get rendertype from request
    rendertype = request.matchdict['rendertype']

    if rendertype == u'full':
        # Add full render and preview job to appropriate queues
        if valid_band_combo(request):
            bands = (request.params.get('band1') +
                     request.params.get('band2') +
                     request.params.get('band3'))
            add_to_queue(request, u'full')
            add_to_queue(request, u'preview')
            return HTTPFound(location='/scene/{}/bands/{}'.format(
                             request.matchdict['scene_id'], bands))
        else:
            raise exc.HTTPBadRequest()
    elif rendertype == u'preview':
        if valid_band_combo(request):
            # Add preview render job to apprpriate queues
            bands = (request.params.get('band1') +
                     request.params.get('band2') +
                     request.params.get('band3'))
            jobid = add_to_queue(request, u'preview')
            try:
                return HTTPFound(location='{}#{}'.format(
                                 request.environ['HTTP_REFERER'], bands))
            except KeyError:
                # when HTTP_REFERER is not set(when called from immediate view)
                return jobid
        else:
            raise exc.HTTPBadRequest()


def valid_band_combo(request):
    """Return true if band combo is valid, False if not."""
    valid = [1, 2, 3, 4, 5, 6, 7, 9]
    try:
        # handles error if band1, 2 or 3 doesn't exist
        bands = [int(request.params.get('band1')),
                 int(request.params.get('band2')),
                 int(request.params.get('band3'))]
    except:
        return False
    # Check if all bands are unique
    unique = len(set(bands)) == 3
    return all(x in valid for x in bands) and unique


@view_config(route_name='scene', renderer='templates/scene.jinja2')
def scene(request):
    """
    Given sceneID display available previews, rendered photos/links, status of
    jobs in process.
    """

    # Get scene id and list of rendered or rendering previews and full
    # composities from the render_cache table
    scene_id = request.matchdict['scene_id']
    rendered_rendering_composites = \
        RenderCache.get_rendered_rendering_composites_sceneid(scene_id)

    # Initialize composties dictionary
    composites = {}

    # Populate composites dictionary with one dictionary per band combination
    if rendered_rendering_composites:
        # Loop through list of rendered or rendering composites
        for composite in rendered_rendering_composites:
            # Get band combination and create string for dictionary key
            band_combo = '{}{}{}'.format(composite.band1,
                                         composite.band2,
                                         composite.band3)
            # If band combination dictionary is not in composites dictionary,
            # add it and initialize it with band values
            if band_combo not in composites:
                composites.update({band_combo: {'band1': composite.band1,
                                                'band2': composite.band2,
                                                'band3': composite.band3}})

            # Build dictionary of composites
            composites = build_composites_dict(composite,
                                               composites,
                                               band_combo)

    # Order composites by band combination.
    composites = OrderedDict(sorted(composites.items()))

    # Get scene metadata from path_row table
    meta_data_list = PathRow.meta_data(scene_id)

    # Build meta data dictionary
    meta_data = build_meta_data(scene_id, meta_data_list)

    return {'meta_data': meta_data, 'composites': composites}


@view_config(route_name='scene_band', renderer='templates/composite.jinja2')
def scene_band(request):
    """Given sceneID and band combination display preview image and metadata."""
    # Get scene id and band combo
    scene_id = request.matchdict['scene_id']
    band_combo = request.matchdict['band_combo']
    band1 = int(band_combo[0])
    band2 = int(band_combo[1])
    band3 = int(band_combo[2])

    rendered_rendering_composites = \
        RenderCache.get_rendered_rendering_composites_band_combo(
            scene_id, band1, band2, band3)

    # Initialize composties dictionary
    composites = {}
    # Populate composites dictionary with one dictionary per band combination
    composites.update({band_combo: {'band1': band1,
                                    'band2': band2,
                                    'band3': band3}})

    # Populate composites dictionary with one dictionary per band combination
    if rendered_rendering_composites:
        # Loop through list of rendered or rendering composites
        for composite in rendered_rendering_composites:

            # Build dictionary of composites
            composites = build_composites_dict(composite,
                                               composites,
                                               band_combo)

    # Order composites by band combination.
    composites = OrderedDict(sorted(composites.items()))

    # Get scene metadata from path_row table
    meta_data_list = PathRow.meta_data(scene_id)

    # Build meta data dictionary
    meta_data = build_meta_data(scene_id, meta_data_list)

    return {'meta_data': meta_data, 'composites': composites}


def build_composites_dict(composite, composites, band_combo):
    """Return dictionary of composites that are rendering or rendered."""

    # If band combination dictionary is not in composites dictionary,
    # add it and initialize it with band values
    if band_combo not in composites:
        composites.update({band_combo: {'band1': composite.band1,
                                        'band2': composite.band2,
                                        'band3': composite.band3}})

    # For full render of a band combination that is currently being
    # rendered update dictionary with status and elapsed time.
    if composite.currentlyrend and composite.rendertype == u'full':
        job_status, start_time, last_modified = (
            UserJob.job_status_and_times(composite.jobid))
        elapsed_time = str(datetime.utcnow() - start_time)
        composites[band_combo].update({'fulljobid': composite.jobid,
                                       'fullurl': False,
                                       'fullstatus': job_status,
                                       'elapsedtime': elapsed_time})

    # For preview render of a band combination that is currently being
    # rendered update dictionary with status.
    if composite.currentlyrend and composite.rendertype == u'preview':
        job_status = UserJob.job_status(composite.jobid)
        composites[band_combo].update({'previewjobid': composite.jobid,
                                       'previewurl': False,
                                       'previewstatus': job_status})

    # For full render of a band combination that has been rendered,
    # update dictionary with status and elapsed time.
    if not composite.currentlyrend and composite.rendertype == u'full':
        job_status, start_time, last_modified = (
            UserJob.job_status_and_times(composite.jobid))
        elapsed_time = str(datetime.utcnow() - start_time)
        composites[band_combo].update({'fulljobid': composite.jobid,
                                       'fullurl': composite.renderurl,
                                       'fullstatus': job_status,
                                       'elapsedtime': elapsed_time})

    # For preview render of a band combination that has been rendered,
    # update dictionary with status.
    if not composite.currentlyrend and composite.rendertype == u'preview':
        job_status = UserJob.job_status(composite.jobid)
        composites[band_combo].update({'previewjobid': composite.jobid,
                                       'previewurl': composite.renderurl,
                                       'previewstatus': job_status})

    return composites


def build_meta_data(scene_id, meta_data_list):
    """Return dictionary of meta data for a given sceneid."""

    return {'scene_id': scene_id,
            'acquisitiondate':
            meta_data_list[0].strftime('%Y/%m/%d %H:%M:%S'),
            'cloudcover': meta_data_list[1],
            'path': meta_data_list[2],
            'row': meta_data_list[3],
            'min_lat': meta_data_list[4],
            'min_lon': meta_data_list[5],
            'max_lat': meta_data_list[6],
            'max_lon': meta_data_list[7],
            'overview_url':
            meta_data_list[8][0:-10]+scene_id+'_thumb_small.jpg'}


@view_config(route_name='scene_options_ajax', renderer='json')
def scene_options_ajax(request):
    """
    Returns a dictionary with all available scenes around the map's center.
    """
    # Lat/lng values default to Seattle, otherwise from Leaflet .getcenter().
    lat = float(request.params.get('lat', 47.614848))
    lng = float(request.params.get('lng', -122.3359059))

    # Correct lng outside of -180 to 180
    lng = ((lng + 180.0) % 360.0) - 180.0
    lng = round(lng, 5)

    # Filter all available scenes to those which encompass the
    # lat/lng provided from the user. Then, populate a list with
    # the information relevant to our view.

    path_row_list = Paths.pathandrow(lat, lng)

    # Check for zero length path row list to prevent return of all path row
    # combinations n ithe world.
    if not path_row_list:
        return {'scenes': []}

    scenes = PathRow.scenelist(path_row_list)
    sceneList = []
    times = 0
    for i, scene in enumerate(scenes):
        sceneList.append({
            'acquisitiondate': scene.acquisitiondate.strftime('%Y %m %d'),
            'acquisitiontime': scene.acquisitiondate,
            'cloudcover': scene.cloudcover,
            'download_url': scene.download_url,
            'entityid': scene.entityid,
            'sliced': scene.entityid[3:9],
            'path': scene.path,
            'row': scene.row})

    # This line may not be necessary.
    sort = sorted(sceneList, key=operator.itemgetter('sliced'), reverse=False)

    # Sort the available scenes based on their Path, then Row.
    outputList = []
    for key, items in itertools.groupby(sort, operator.itemgetter('sliced')):
        outputList.append(list(items))

    # Sort the vailable scenes in each group by date in reverse.
    for group in outputList:
        group.sort(key=operator.itemgetter('acquisitiondate'), reverse=True)

    for group in outputList:
        times = 0
        for subgroup in group:
            time_strtime = subgroup['acquisitiontime'].strftime('%H:%M:%S')
            stripped_strtime = time.strptime(time_strtime.split(',')[0],
                                             '%H:%M:%S')
            times += timedelta(hours=stripped_strtime.tm_hour,
                               minutes=stripped_strtime.tm_min,
                               seconds=stripped_strtime.tm_sec
                               ).total_seconds()
            subgroup['acquisitiontime'] = time_strtime

        average_seconds = times / len(group)
        average_time = time.strftime('%H:%M', time.gmtime(average_seconds))

        for subgroup in group:
            subgroup['average_time'] = average_time

    return {'scenes': outputList}


@view_config(route_name='immediate_preview_ajax', renderer='json')
def immediate_preview_ajax(request):
    """
    Returns preview given lat/lng (from user ip).
    """
    # Lat/lng values default to Seattle, otherwise from Leaflet .getcenter().
    lat = float(request.params.get('lat', 47.614848))
    lng = float(request.params.get('lng', -122.3359059))

    # Correct lng outside of -180 to 180
    lng = ((lng + 180.0) % 360.0) - 180.0
    lng = round(lng, 5)

    # Filter all available scenes to those which encompass the
    # lat/lng provided from the user. Then, populate a list with
    # the information relevant to our view.

    path_row_list = Paths.pathandrow(lat, lng)

    # Check for zero length path row list to prevent return of all path row
    # combinations n ithe world.
    if not path_row_list:
        return {'scenes': []}

    def dist(lat, lng, center_lat, center_lng):
        return ((lat-center_lat)**2 + (lng-center_lng)**2)**0.5

    def best_path_row(path_row_list):
        """
        Given path_row_list sqlalchemy result list, return index/(path/row)
        where user lat/lng is closest to center of path/row.
        """
        path_row = []
        # get min and max lat lng
        for num, x in enumerate(path_row_list):
            path_row.append(PathRow.lat_lng(x))

        # compute distances
        distances = []
        for num, x in enumerate(path_row):
            center_lat = (x[0]+x[2])/2
            center_lng = (x[1]+x[3])/2
            distances.append(dist(lat, lng, center_lat, center_lng))

        return distances.index(min(distances))

    # Select best path/row
    if len(path_row_list) > 1:
        temp = path_row_list[best_path_row(path_row_list)]
        path_row_list[:] = []
        path_row_list.append(temp)

    # Get scene with lowest cloud cover
    entityid = PathRow.scene_lowest_cloud(path_row_list)[0]

    # create subrequest to call request/preview view
    subreq = Request.blank('/request/preview/{}/?band1={}&band2={}&band3={}'.
                           format(entityid, 5, 4, 3))

    response = request.invoke_subrequest(subreq, use_tweens=True)

    return {'jobid': response.json_body}


@view_config(route_name='status_poll', renderer='json')
def status_poll(request):
    """
    Poll database for full render job status.
    """

    # Get jobid from request
    jobid = request.params.get('jobid')
    # Query the database for job status, start time, last modified time
    job_status, start_time, last_modified = (
        UserJob.job_status_and_times(jobid))
    # Calcuate elapsed time
    elapsed_time = str(datetime.utcnow() - start_time)

    # Get render url when job is done
    if job_status == 'Done':
        render_url = RenderCache.get_renderurl(jobid)
    else:
        render_url = None

    # Create job info json output
    job_info = {'jobstatus': job_status,
                'elapsedtime': elapsed_time,
                'renderurl': render_url}

    return {'job_info': job_info}


@view_config(route_name='preview_poll', renderer='json')
def preview_poll(request):
    """
    Poll database for preview render job status.
    """

    # Get jobid from request
    jobid = request.params.get('jobid')
    # Query the database for job status
    job_status, scene_id, band1, band2, band3 = UserJob.job_status(jobid)

    # Get render url when job is done
    if job_status == 'Done':
        render_url = RenderCache.get_renderurl(jobid)
    else:
        render_url = None

    # Create job info json output
    job_info = {'jobstatus': job_status,
                'renderurl': render_url,
                'scene_id': scene_id,
                'band1': band1,
                'band2': band2,
                'band3': band3}

    return {'job_info': job_info}
