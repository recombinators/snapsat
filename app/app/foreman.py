from boto.ec2 import connect_to_region
import sqs
import os


AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
JOBS_QUEUE = 'landsat_jobs_queue'
REGION = 'us-west-2'


def make_connection():
    '''Make EC2 connection to AWS'''
    EC2conn = connect_to_region(REGION,
                                aws_access_key_id=AWS_ACCESS_KEY_ID,
                                aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
    return EC2conn


def foreman(EC2conn):
    pass


def spawn_worker(EC2conn):
    pass


def kill_worker(EC2conn):
    pass


def list_workers(EC2conn):

    return workers
