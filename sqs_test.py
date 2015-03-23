import boto.sqs
from boto.sqs.message import Message
from pprint import pprint


def main():
    aws_region = 'us-west-2'
    conn = boto.sqs.connect_to_region(aws_region, profile_name='landsatAWS')
    q = conn.get_queue('landsat_render_queue')

    m = Message()
    m.set_body('This is my first message.')
    q.write(m)

    # m2 = Message()
    # m2.set_body('This is my second message.')
    # m2.message_attributes = {
    #     "name1": {
    #         "data_type": "String",
    #         "string_value": "I am a string"
    #     },
    #     "name2": {
    #         "data_type": "Number",
    #         "string_value": "12"
    #     }
    # }
    # q.write(m2)

    pprint(q.count())
    pprint(q.purge())
    pprint(q.count())


if __name__ == '__main__':
    main()
