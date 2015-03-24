import boto.sqs
from boto.sqs.message import Message
import pprint
import os


aws_access_key_id = os.environ['AWS_ACCESS_KEY_ID']
aws_secret_access_key = os.environ['AWS_SECRET_KEY_ID']


def make_connection():
    return boto.sqs.connect_to_region("us-west-2",
                                      aws_access_key_id=aws_access_key_id,
                                      aws_secret_access_key=aws_secret_access_key)


def get_queue(queue_name, conn):
    return conn.get_queue(queue_name)


def enqueue_message(message, queue):
    queue.write(message)


def delete_message_from_queue(message, queue):
    queue.delete_message(message)


def queue_size(queue):
    return queue.count()


def build_job_message(kwargs):
    job_message = Message()
    job_message.set_body('job')
    job_message.message_attributes = {
        'job_id': {
            'data_type': 'Number',
            'string_value': kwargs['job_id']
            },
        'email': {
            'data_type': 'String',
            'string_value': kwargs['email']
            },
        'date': {
            'data_type': 'String',
            'string_value': kwargs['date']
            },
        'latitude': {
            'data_type': 'Number',
            'string_value': kwargs['latitude']
            },
        'longitude': {
            'data_type': 'Number',
            'string_value': kwargs['longitude']
            },
        'band_1': {
            'data_type': 'Number',
            'string_value': kwargs['band_1']
            },
        'band_2': {
            'data_type': 'Number',
            'string_value': kwargs['band_2']
            },
        'band_3': {
            'data_type': 'Number',
            'string_value': kwargs['band_3']
            }
        }
    return job_message


def get_message(jobs_queue):
    return jobs_queue.get_messages(message_attributes=['All'])


def do_work(job_message):
    return {'job_id': job_message[0].message_attributes['job_id']['string_value'],
            'email': job_message[0].message_attributes['email']['string_value'],
            'link': 's3.fake.notreal.imaginary.com',
            'scene_id': 'LC1234567890123456789'
            }


def build_result_message(kwargs):
    result_message = Message()
    result_message.set_body('result')
    result_message.message_attributes = {
        'job_id': {
            'data_type': 'Number',
            'string_value': kwargs['job_id']
            },
        'email': {
            'data_type': 'String',
            'string_value': kwargs['email']
            },
        'link': {
            'data_type': 'String',
            'string_value': kwargs['link']
            },
        'scene_id': {
            'data_type': 'String',
            'string_value': kwargs['scene_id']
            }
        }
    return result_message


def build_user_message(kwargs):
    user_message = '''Job ID {job_id}.
Follow this link to your results {link}.
The Scene Id for your request is {scene_id}.
Have a nice day {email}\n'''.format(**kwargs)
    return user_message


if __name__ == '__main__':
    print('Create job.\n')
    print('Connect to jobs queue.')
    conn = make_connection()
    jobs_queue = get_queue('landsat_jobs_queue', conn)
    print(jobs_queue)
    print('\n')

    print('Create a job message')
    job_message = build_job_message({'job_id': 1,
                                     'email': 'noone@nowhere.com',
                                     'date': '20150323',
                                     'latitude': 47.623573,
                                     'longitude': -122.336069,
                                     'band_1': 4,
                                     'band_2': 3,
                                     'band_3': 2
                                     })
    pprint.pprint(job_message.message_attributes)
    print('\n')

    print('Send job to jobs queue.')
    enqueue_message(job_message, jobs_queue)
    print(queue_size(jobs_queue))
    print('\n')

    print('Connect to jobs queue.')
    jobs_queue = get_queue('landsat_jobs_queue', conn)
    print(jobs_queue)
    print('\n')

    print('Get job.')
    job_message = get_message(jobs_queue)
    pprint.pprint(job_message[0].message_attributes)
    print('\n')

    print('Do work.')
    kwargs = do_work(job_message)
    pprint.pprint(kwargs)
    print('\n')

    print('Delete job from jobs queue.')
    delete_message_from_queue(job_message[0], jobs_queue)
    print(queue_size(jobs_queue))
    print('\n')

    print('Connect to results queue.')
    results_queue = get_queue('landsat_results_queue', conn)
    print(results_queue)
    print('\n')

    print('Create result message.')
    result_message = build_result_message(kwargs)
    pprint.pprint(result_message.message_attributes)
    print('\n')

    print('Send result to results queue.')
    enqueue_message(result_message, results_queue)
    print(queue_size(results_queue))
    print('\n')

    print('Connect to results queue.')
    results_queue = get_queue('landsat_results_queue', conn)
    print(results_queue)
    print('\n')

    print('Get result.')
    result_message = get_message(results_queue)
    pprint.pprint(result_message[0].message_attributes)
    print('\n')

    print('Delete result from results queue.')
    delete_message_from_queue(result_message[0], results_queue)
    print(queue_size(results_queue))
    print('\n')

    print('Create user message.')
    user_message = build_user_message(kwargs)
    print(user_message)
    print('\n')
