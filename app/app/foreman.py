from __future__ import unicode_literals
from boto.ec2.connection import EC2Connection
from boto.ec2 import get_region
from sqs import (make_SQS_connection, get_queue, queue_size,)
from operator import attrgetter

JOBS_QUEUE = 'landsat_jobs_queue'
STATE_CODES = {'pending': 0,
               'runnning': 16,
               'shutting-down': 32,
               'terminated': 48,
               'stopping': 64,
               'stopped': 80
               }
LIMITS = {'low': 20, 'med': 50}
TEAMS = {'A': 5, 'B': 10}
NEW_WORKER_STATS = {'AMI': 'ami-5f517f6f',
                    'KEY_PAIR': 'landsatproject',
                    'SECURITY_GROUP': 'launch-wizard-1',
                    'INSTANCE_TYPE': 't2.medium',
                    'AVAILIBILITY_ZONE': 'us-west-2a',
                    'Name': 'landsatAWS_worker',
                    'Schedule': 'contractor',
                    }


def make_EC2_connection(region_name, aws_access_key_id, aws_secret_access_key):
    '''Make EC2 connection to AWS'''
    return EC2Connection(aws_access_key_id=aws_access_key_id,
                         aws_secret_access_key=aws_secret_access_key,
                         region=get_region(region_name))


def foreman(conn, region_name, aws_access_key_id, aws_secret_access_key):
    '''Manage workers and queue.'''
    SQSconn = make_SQS_connection(region_name,
                                  aws_access_key_id,
                                  aws_secret_access_key)
    jobs_queue = get_queue(SQSconn, JOBS_QUEUE)
    number_queued_jobs = queue_size(jobs_queue)

    workers = list_worker_instances(conn, 'landsatAWS_worker')

    adjust_team_size(conn, workers, number_queued_jobs)


def adjust_team_size(conn, workers, number_queued_jobs):
    '''Check status of queue and spawn/kill workers as needed'''
    running_workers = list_running_workers(workers)
    parttime_workers = list_parttime_workers(workers)
    stopped_parttime_workers = list_stopped_workers(parttime_workers)
    if number_queued_jobs >= LIMITS['med']:
        number_running = len(running_workers)
        worker_deficit = TEAMS['B'] - number_running
        if worker_deficit > 0:
            if len(stopped_parttime_workers) > 0:
                for stopped in stopped_parttime_workers:
                    stopped.start()
                workers = list_worker_instances(conn, 'landsatAWS_worker')
                number_running = len(list_running_workers(workers))
                number_pending = len(list_pending_instances(workers))
                worker_deficit = TEAMS['B'] - number_pending + number_running
                if worker_deficit > 0:
                    spawn_reservation = spawn_workers(conn, worker_deficit)
                    tag_instances(spawn_reservation.instances,
                                  'Name',
                                  NEW_WORKER_STATS['Name'])
    elif LIMITS['med'] > number_queued_jobs >= LIMITS['low']:
        worker_deficit = TEAMS['A'] - len(running_workers)
        if worker_deficit > 0:
            for stopped in stopped_parttime_workers:
                stopped.start()
    elif LIMITS['low'] / 2 > number_queued_jobs:
        contractor_workers = list_contractor_workers(workers)
        if contractor_workers:
            kill_workers(contractor_workers)
    elif LIMITS['low'] / 4 > number_queued_jobs:
        parttime_workers = list_parttime_workers(workers)
        if parttime_workers:
            stop_workers(parttime_workers)


def spawn_workers(conn, count):
    '''Create COUNT more workers.'''
    return conn.run_instances(NEW_WORKER_STATS['AMI'],
                              min_count=count,
                              max_count=count,
                              key_name=NEW_WORKER_STATS['KEY_PAIR'],
                              security_groups=[NEW_WORKER_STATS['SECURITY_GROUP']],
                              instance_type=NEW_WORKER_STATS['INSTANCE_TYPE'],
                              placement=NEW_WORKER_STATS['AVAILIBILITY_ZONE']
                              )


def kill_workers(workers):
    '''Terminate worker instances. Expects list of workers.'''
    for worker in workers:
        worker.terminate


def stop_workers(workers):
    '''Stop worker instances. Expects list of workers.'''
    for worker in workers:
        worker.stop


def list_worker_instances(conn, worker_type):
    '''Return list of worker instances in order of lauch time, most recent
       first.'''
    filters = {'tag:Name': worker_type}
    instances = conn.get_only_instances(filters=filters)
    instances.sort(key=attrgetter('launch_time'), reverse=True)
    return instances


def list_running_workers(workers):
    '''Return list of runnning workers.'''
    return [worker for worker in workers
            if worker.state_code == STATE_CODES['runnning']]


def list_stopped_workers(workers):
    '''Return list of stopped workers.'''
    return [worker for worker in workers
            if worker.state_code == STATE_CODES['stopped']]


def list_pending_instances(workers):
    '''Return list of pending workers.'''
    return [worker for worker in workers
            if worker.state_code == STATE_CODES['pending']]


def list_parttime_workers(workers):
    '''Return list of parttime workers.'''
    return [worker for worker in workers
            if worker.tags['Schedule'] == 'parttime']


def list_contractor_workers(workers):
    '''Return list of contractor workers.'''
    return [worker for worker in workers
            if worker.tags['Schedule'] == NEW_WORKER_STATS['Schedule']]


def tag_instances(instances, tag_value_dict):
    '''Add tags to instances. Expects a list of instances and a dict of
       tag: value.'''
    for instance in instances:
        instance.add_tags(tag_value_dict)


if __name__ == '__main__':
    import os

    AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
    AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
    REGION = 'us-west-2'

    EC2conn = make_EC2_connection(REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
    worker_type = 'landsatAWS_worker'
    workers = list_worker_instances(EC2conn, worker_type)
    running_workers = list_running_workers(workers)
    parttime_workers = list_parttime_workers(workers)
    stopped_parttime_workers = list_stopped_workers(parttime_workers)
    number_running = len(running_workers)
    worker_deficit = TEAMS['B'] - number_running
    spawn_reservation = spawn_workers(EC2conn, 1)
    import ipdb; ipdb.set_trace()
    tag_instances(spawn_reservation.instances,
                  {'Name': NEW_WORKER_STATS['Name'],
                   'Schedule': NEW_WORKER_STATS['Schedule']}
                  )
    workers = list_worker_instances(EC2conn, 'landsatAWS_worker')
    pending = list_pending_instances(workers)
    print(pending)
    print(workers)
