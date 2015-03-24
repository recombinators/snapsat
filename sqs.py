from boto.sqs import connect_to_region
from boto.sqs.message import Message


def make_connection(kwargs):
    return connect_to_region(kwargs['region'],
                             aws_access_key_id=kwargs['aws_access_key_id'],
                             aws_secret_access_key=kwargs['aws_secret_access_key'])


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


def get_job_message(jobs_queue):
    return jobs_queue.get_messages(message_attributes=['job_id',
                                                       'email',
                                                       'date',
                                                       'latitude',
                                                       'longitude',
                                                       'band_1',
                                                       'band_2',
                                                       'band_3'
                                                       ])


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


def get_result_message(results_queue):
    return results_queue.get_messages(message_attributes=['job_id',
                                                          'email',
                                                          'link',
                                                          'scene_id'
                                                          ])
