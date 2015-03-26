from boto.ec2 import connection
from boto.sqs import regions
import os


def make_connection(region_name, aws_access_key_id, aws_secret_access_key):
    '''Make EC2 connection to AWS'''
    for reg in regions():
        if reg.name == region_name:
            region = reg
            break

    EC2conn = connection(aws_access_key_id=aws_access_key_id,
                         aws_secret_access_key=aws_secret_access_key,
                         region=region)
    return EC2conn


def foreman(conn):
    pass


def spawn_worker(conn):
    pass


def kill_worker(conn):
    pass


def list_workers(conn):
    reservations = conn.get_all_reservations()
    return workers
