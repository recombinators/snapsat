from boto.ec2.connection import EC2Connection
from boto.ec2 import get_region
import os


def make_connection(region_name, aws_access_key_id, aws_secret_access_key):
    '''Make EC2 connection to AWS'''

    return EC2Connection(aws_access_key_id=aws_access_key_id,
                         aws_secret_access_key=aws_secret_access_key,
                         region=get_region(region_name))


def foreman(conn):
    pass


def spawn_worker(conn):
    pass


def kill_worker(conn):
    pass


def list_worker_instances(conn):
    filters = {'tag:Name': 'landsatAWS_worker'}
    reservations = conn.get_only_instances(filters=filters)

    return reservations


if __name__ == '__main__':
    AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
    AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
    JOBS_QUEUE = 'landsat_jobs_queue'
    REGION = 'us-west-2'

    conn = make_connection(REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
    workers = list_worker_instances(conn)
    import ipdb; ipdb.set_trace()
    print(workers)
