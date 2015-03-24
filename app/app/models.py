import sqlalchemy as sa
from sqlalchemy import (
    Column,
    Index,
    Integer,
    Text,
    )

from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import (
    scoped_session,
    sessionmaker,
    )

from zope.sqlalchemy import ZopeTransactionExtension

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()


class PathAndRow_Model(Base):
    '''Model for path and row table.'''
    __tablename__ = 'path_row'

    gid = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
    geom = sa.Column(sa.UnicodeText, nullable=False)
    path = sa.Column(sa.Integer, nullable=False)
    row = sa.Column(sa.Integer, nullable=False)

    @classmethod
    def pathandrow(cls, lat, lon):
        """Output path and row that contains lat lon."""
        try:
            return (DBSession.query(cls)
                    .filter(func.ST_Within(func.ST_SetSRID(func
                            .ST_MakePoint(lon, lat), 4236), func
                        .ST_SetSRID(cls.geom, 4236))).one().name
                    )
        except:
            return u'----'


# class Incidents_Model(Base):
#     """SQLalchemy model for incident table."""
#     __tablename__ = 'incidents'
#     gid = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
#     units = sa.Column(sa.UnicodeText, nullable=False)
#     date_time = sa.Column(sa.DateTime, nullable=False)
#     incident_type = sa.Column(sa.UnicodeText, nullable=False)
#     address = sa.Column(sa.UnicodeText, nullable=False)
#     incident_number = sa.Column(sa.UnicodeText, nullable=False)
#     latitude = sa.Column(sa.UnicodeText, nullable=False)
#     longitude = sa.Column(sa.UnicodeText, nullable=False)
#     major_category = sa.Column(sa.UnicodeText, nullable=False)
#     minor_category = sa.Column(sa.UnicodeText, nullable=False)
#     the_geom = sa.Column(sa.UnicodeText, nullable=False)

#     @classmethod
#     def cat_circle(cls, lat, lon, major_cat, radius=0.0067):
#         """Outputs list of incidents filtered by Major Category"""
#         return (DBSession.query(cls.date_time)
#                 # .order_by(func.random())
#                 .filter(func.ST_Point_Inside_Circle(cls.the_geom, lon, lat,
#                                                     radius),
#                         cls.major_category == major_cat).all()
#                 )

#     @classmethod
#     def percentage(cls, list_of_times):
#         """Given a list of epoch times, return a dict with percent increase
#         as HTML and the number of incidents, over the last year."""
#         try:
#             # Define one year ago as 365 days before the most recent incident
#             one_year_ago_epoch = list_of_times[-1]-365
#             length_list = len(list_of_times)
#             # print "length: {}".format(length_list)

#             # Count number of incidents before one year ago.
#             incidents_prior = 0
#             for time in list_of_times:
#                 if time < one_year_ago_epoch:
#                     incidents_prior += 1
#                 if time > one_year_ago_epoch:
#                     break
#             # Calculate percentage change
#             incidents_last_year = length_list-incidents_prior
#             years_prior = (one_year_ago_epoch-list_of_times[0])/365
#             incidents_per_year_prior = incidents_prior/years_prior
#             incidents_per_year_last_year = incidents_last_year
#             percent = (
#                 100*(incidents_per_year_last_year-incidents_per_year_prior)
#                 / incidents_per_year_prior)

#             # Prepare HTML with appropriate class so font color changes.
#             if percent >= 0:
#                 pos_neg = ("pos", "increased")
#             else:
#                 pos_neg = ("neg", "decreased")
#             return_string = (
#                 '<span class="{}">{} {}%</span>'.format(pos_neg[0], pos_neg[1],
#                                                         abs(round(percent, 2)))
#                 )
#         except:     # In case that no incidents are found in certain area
#             return_string = '<span class="no_change">---- 0.00%   </span>'
#             incidents_last_year = 0
#         return {'string': return_string, 'year_count': incidents_last_year, 'prior_rate': incidents_per_year_prior}


# class MyModel(Base):
#     __tablename__ = 'models'
#     id = Column(Integer, primary_key=True)
#     name = Column(Text)
#     value = Column(Integer)

# Index('my_index', MyModel.name, unique=True, mysql_length=255)
