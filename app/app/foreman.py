import boto.ec2
import sqs
import os


AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
JOBS_QUEUE = 'landsat_jobs_queue'
REGION = 'us-west-2'


def foreman():
    pass


def spawn_worker():
    pass


def kill_worker():
    pass


def list_workers():

    return workers
