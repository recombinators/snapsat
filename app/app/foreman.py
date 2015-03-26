from boto.ec2.connection import EC2Connection
from boto.ec2 import get_region
from sqs import (make_SQS_connection, get_queue, build_job_message, send_message,
                 queue_size,)
from operator import attrgetter


def make_EC2_connection(region_name, aws_access_key_id, aws_secret_access_key):
    '''Make EC2 connection to AWS'''

    return EC2Connection(aws_access_key_id=aws_access_key_id,
                         aws_secret_access_key=aws_secret_access_key,
                         region=get_region(region_name))


def foreman(conn):
    '''Check status of queue and spaqn/kill workers as needed'''

    pass


def spawn_worker(conn):
    pass


def kill_worker(conn):
    pass


def list_worker_instances(conn, worker_type):
    '''Return list of worker instances in order of lauch time, most recent
       first.'''

    filters = {'tag:Name': worker_type}
    instances = conn.get_only_instances(filters=filters)
    instances.sort(key=attrgetter('launch_time'), reverse=True)
    return instances


if __name__ == '__main__':
    import os

    AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
    AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
    JOBS_QUEUE = 'landsat_jobs_queue'
    REGION = 'us-west-2'

    conn = make_connection(REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
    worker_type = 'landsatAWS_worker'
    workers = list_worker_instances(conn, worker_type)
    import pdb; pdb.set_trace()
    print(workers)
