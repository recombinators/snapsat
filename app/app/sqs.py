from boto.sqs import connect_to_region
from boto.sqs.message import Message


def make_connection(**kwargs):
    '''Make a connection to an AWS account. Kwargs is a dictionary of the AWS
       region, AWS access key id, and AWS secret access key'''
    return connect_to_region(region_name='us-west-2',
                             aws_access_key_id=kwargs['aws_access_key_id'],
                             aws_secret_access_key=kwargs['aws_secret_access_key'])


def get_queue(queue_name, conn):
    '''Create a queue with the given name, or get an existing queue with that
       name from the AWS connection.'''
    return conn.create_queue(queue_name)


def enqueue_message(message, queue):
    '''Write a message to the given queue.'''
    return queue.write(message)


def get_message(queue, num_messages=1, visibility_timeout=300,
                wait_time_seconds=20):
    '''Get a message from the given queue. Default visibility timeout is
       5 minutes, message wait time is 20 seconds, number of messages is 1.''' 
    return queue.get_messages(visibility_timeout=visibility_timeout,
                              wait_time_seconds=wait_time_seconds,
                              message_attributes=['All'])


def get_attributes(message):
    '''Return a dictionary of the message attributes.'''
    return {key: value['string_value']
            for key, value in message[0].message_attributes.iteritems()}


def delete_message_from_queue(message, queue):
    '''Delete a message from the given queue.'''
    return queue.delete_message(message)


def queue_size(queue):
    '''Get the approximate number of messages in the given queue.'''
    return queue.count()


def build_job_message(**kwargs):
    '''Build a meesage to add to the jobs queue.'''
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
        'scene_id': {
            'data_type': 'String',
            'string_value': kwargs['scene_id']
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


def build_result_message(**kwargs):
    '''Build a message to add to the results queue.'''
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
if __name__ == '__main__':
    import os
    LANDSAT_JOBS_QUEUE = 'landsat_jobs_queue'
    conn = make_connection(aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                           aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'])
    queue = get_queue(LANDSAT_JOBS_QUEUE, conn)
    message = build_job_message(job_id=1, email='test', scene_id='LC13',
                                band_1=4, band_2=3, band_3=2)
    enqueue_message(message, queue)
    print(queue_size(queue))
    message = get_message(queue)
    attrs = get_attributes(message)
    print(attrs)
