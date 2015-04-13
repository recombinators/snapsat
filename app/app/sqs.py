from boto.sqs import connect_to_region


def make_SQS_connection(region_name, aws_access_key_id, aws_secret_access_key):
    """
    Make an SQSconnection to an AWS account. Pass in region, AWS access
    key id, and AWS secret access key
    """
    return connect_to_region(region_name,
                             aws_access_key_id=aws_access_key_id,
                             aws_secret_access_key=aws_secret_access_key)


def get_queue(conn, queue_name):
    """
    Create a queue with the given name, or get an existing queue with that
    name from the AWS connection.
    """
    return conn.get_queue(queue_name)


def get_message(queue, num_messages=1, visibility_timeout=300,
                wait_time_seconds=20):
    """
    Get a message from the given queue. Default visibility timeout is
    5 minutes, message wait time is 20 seconds, number of messages is 1.
    """
    return queue.get_messages(visibility_timeout=visibility_timeout,
                              wait_time_seconds=wait_time_seconds,
                              message_attributes=['All'])


def get_attributes(message):
    """
    Return a dictionary of the message attributes.
    """
    return {key: value['string_value']
            for key, value in message[0].message_attributes.iteritems()}


def delete_message_from_handle(conn, queue, message):
    """
    Delete a message from the given queue.
    """
    return conn.delete_message_from_handle(queue, message.receipt_handle)


def queue_size(queue):
    """
    Get the approximate number of messages in the given queue.
    """
    return queue.count()


def build_job_message(**kwargs):
    """
    Build a meesage to add to the jobs queue.
    """
    job_message = {'body': 'job'}
    job_message['attributes'] = {
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
    """
    Build a message to add to the results queue.
    """
    result_message = {'body': 'result'}
    result_message['attributes'] = {
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


def send_message(conn, queue, message_content, message_attributes=None):
    """
    Write a message to the given queue.
    """
    return conn.send_message(queue=queue,
                             message_content=message_content,
                             message_attributes=message_attributes)
