# import sqlalchemy as sa
from sqlalchemy import Column, Index, Integer, UnicodeText, func, DateTime, Float, or_, and_
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from zope.sqlalchemy import ZopeTransactionExtension

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()


class PathAndRow_Model(Base):
    '''Model for path and row table.'''
    __tablename__ = 'paths'

    gid = Column(UnicodeText, primary_key=True, autoincrement=True)
    geom = Column(UnicodeText, nullable=False)
    path = Column(Integer, nullable=False)
    row = Column(Integer, nullable=False)

    @classmethod
    def pathandrow(cls, lat, lon):
        """Output path and row that contains lat lon."""
        try:
            scene = (DBSession.query(cls)
                    .filter(func.ST_Within(func.ST_SetSRID(func
                            .ST_MakePoint(lon, lat), 4236), func
                        .ST_SetSRID(cls.geom, 4236))).all()
                    )
            return scene
        except:
            return u'----'


class SceneList_Model(Base):
    '''Model for AWS S3 scene list.'''
    __tablename__ = 'path_row'
    entityid = Column(UnicodeText, primary_key=True)
    acquisitiondate = Column(DateTime, nullable=False)
    cloudcover = Column(Float, nullable=False)
    path = Column(Integer, nullable=False)
    row = Column(Integer, nullable=False)
    download_url = Column(UnicodeText, nullable=False)

    @classmethod
    def scenelist(cls, pr_output):
        new = []
        for x in pr_output:
            new.append(and_(cls.row == x.row, cls.path == x.path))
        return DBSession.query(cls).filter(or_(*new))
