from sqlalchemy import (Column, Integer, Boolean, UnicodeText, func, DateTime,
                        Float, or_, and_, )
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from zope.sqlalchemy import ZopeTransactionExtension
import transaction
from datetime import datetime

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()


class Paths_Model(Base):
    '''Model for paths table.'''
    __tablename__ = 'paths'

    gid = Column(UnicodeText, primary_key=True, autoincrement=True)
    geom = Column(UnicodeText, nullable=False)
    path = Column(Integer, nullable=False)
    row = Column(Integer, nullable=False)
    mode = Column(UnicodeText, nullable=False)

    @classmethod
    def pathandrow(cls, lat, lon):
        """
        Output path and row that contains lat lon.
        """
        try:
            scene = (DBSession.query(cls).filter(
                func.ST_Within(func.ST_SetSRID(
                    func.ST_MakePoint(float(lon), float(lat)), 4236), 
                    func.ST_SetSRID(cls.geom, 4236)), cls.mode == u'D').all()
                    )
            return scene
        except:
            return u'----'


class PathRow_Model(Base):
    '''Model for AWS S3 path and row list.'''
    __tablename__ = 'path_row'
    entityid = Column(UnicodeText, primary_key=True)
    acquisitiondate = Column(DateTime, nullable=False)
    cloudcover = Column(Float, nullable=False)
    path = Column(Integer, nullable=False)
    row = Column(Integer, nullable=False)
    download_url = Column(UnicodeText, nullable=False)

    @classmethod
    def scenelist(cls, pr_output):
        """
        For Constantine
        """
        new = []
        for x in pr_output:
            new.append(and_(cls.row == x.row, cls.path == x.path))
        return DBSession.query(cls).filter(or_(*new))


class UserJob_Model(Base):
    """
    Model for the user job queue. Possible job statuses:
    0 - Created
    1 - Queued
    2 - Processing
    3 - Done (Failed)
    4 - Done (Success)
    """

    __tablename__ = 'user_job'
    jobid = Column(Integer, primary_key=True)
    entityid = Column(UnicodeText)
    userip = Column(UnicodeText)
    email = Column(UnicodeText)
    band1 = Column(Integer)
    band2 = Column(Integer)
    band3 = Column(Integer)
    jobstatus = Column(Integer, nullable=False)
    starttime = Column(DateTime, nullable=False)
    lastmodified = Column(DateTime, nullable=False)
    status1time = Column(DateTime)
    status2time = Column(DateTime)
    status3time = Column(DateTime)
    status4time = Column(DateTime)
    status5time = Column(DateTime)
    status10time = Column(DateTime)
    rendertype = Column(UnicodeText)

    @classmethod
    def new_job(cls,
                entityid=entityid,
                band1=4,
                band2=3,
                band3=2,
                jobstatus=0,
                starttime=datetime.utcnow(),
                rendertype=rendertype
                ):
        """
        Create new job in db.
        """
        try:
            session = DBSession
            current_time = datetime.utcnow()
            job = UserJob_Model(entityid=entityid,
                                band1=band1,
                                band2=band2,
                                band3=band3,
                                jobstatus=0,
                                starttime=current_time,
                                lastmodified=current_time,
                                rendertype=rendertype
                                )
            session.add(job)
            session.flush()
            session.refresh(job)
            pk = job.jobid
            transaction.commit()
            # Could do this or a subtransacation,
            # ie: open a transaction at the beginning of this method.
            transaction.begin()
        except:
            return None
        try:
            RenderCache_Model.add(pk, True, rendertype)
        except:
            print 'Could not add job to rendered db'
        return pk

    @classmethod
    def set_job_status(cls, jobid, status, url=None):
        """
        Set jobstatus for jobid passed in.
        """
        table_key = {1: "status1time",
                     2: "status2time",
                     3: "status3time",
                     4: "status4time",
                     5: "status5time",
                     10: "status10time"}
        try:
            current_time = datetime.utcnow()
            DBSession.query(cls).filter(cls.jobid == jobid).update(
                                    {"jobstatus": status,
                                     table_key[int(status)]: current_time,
                                     "lastmodified": current_time
                                     })
            transaction.commit()
        except:
            print 'database write failed'
        # Tell render_cache db we have this image now
        if int(status) == 5:
            try:
                RenderCache_Model.update(jobid, False, url)
            except:
                print 'Could not update Rendered db'

    @classmethod
    def job_status(cls, jobid):
        """
        Get jobstatus for jobid passed in.
        """
        status_key = {0: "In queue",
                      1: "Downloading",
                      2: "Processing",
                      3: "Compressing",
                      4: "Uploading to server",
                      5: "Done",
                      10: "Failed"}
        try:
            job = DBSession.query(cls).get(jobid)
            print job.jobstatus
        except:
            print 'database write failed'
            return None
        return status_key[job.jobstatus]

    @classmethod
    def job_times(cls, jobid):
        """
        Get times for jobid passed in.
        """
        try:
            job = DBSession.query(cls).get(jobid)
            return job.starttime, job.lastmodified
        except:
            print 'database operation failed'

    @classmethod
    def job_status_and_times(cls, jobid):
        """
        Get status and times for jobid passed in.
        """
        try:
            job_info = DBSession.query(UserJob_Model.jobstatus,
                                       UserJob_Model.starttime,
                                       UserJob_Model.lastmodified).filter(
                UserJob_Model.jobid == 346).one()
            return job_info
        except:
            print 'database operation failed'


class RenderCache_Model(Base):
    '''Model for the already render_cache table'''
    __tablename__ = 'render_cache'
    id = Column(Integer, primary_key=True)
    jobid = Column(Integer)
    entityid = Column(UnicodeText)
    band1 = Column(Integer)
    band2 = Column(Integer)
    band3 = Column(Integer)
    previewurl = Column(UnicodeText)
    renderurl = Column(UnicodeText)
    rendercount = Column(Integer, default=0)
    currentlyrend = Column(Boolean)
    rendertype = Column(UnicodeText)

    @classmethod
    def add(cls, jobid, currentlyrend, rendertype):
        """
        Method adds entry into db given jobid and optional url.
        """
        jobQuery = DBSession.query(UserJob_Model).get(jobid)
        job = RenderCache_Model(entityid=jobQuery.entityid,
                                jobid=jobid,
                                band1=jobQuery.band1,
                                band2=jobQuery.band2,
                                band3=jobQuery.band3,
                                currentlyrend=currentlyrend,
                                rendertype=rendertype
                                )
        DBSession.add(job)
        transaction.commit()

    @classmethod
    def update(cls, jobid, currentlyrend, renderurl):
        """
        Method updates entry into db given jobid and optional url.
        """
        try:
            DBSession.query(cls).filter(cls.jobid == jobid).update({
                "currentlyrend": currentlyrend, "renderurl": renderurl})
        except:
            print 'could not update db'

    @classmethod
    def get_rendered_rendering(cls, entityid):
        """
        Return list of existing jobs for a given sceneID.
        """
        try:
            rendered = DBSession.query(cls).filter(
                cls.entityid == entityid,
                cls.currentlyrend is not True).all()
        except:
            print 'Database query failed'
            return None
        return rendered

    @classmethod
    def full_render_availability(cls, entityid, band1, band2, band3):
        """
        Check if given image is already rendered.
        """
        try:
            output = DBSession.query(cls).filter(cls.entityid == entityid,
                                                 cls.band1 == band1,
                                                 cls.band2 == band2,
                                                 cls.band3 == band3,
                                                 cls.rendertype == 'composite',
                                                 cls.renderurl.isnot(None)).count()
        except:
            print 'Database query failed'
            return None
        if output != 0:
            # if this scene/band has already been requested, increase the count
            DBSession.query(cls).filter(cls.entityid == entityid,
                                        cls.band1 == band1,
                                        cls.band2 == band2,
                                        cls.band3 == band3,
                                        cls.rendertype == 'composite').update({
                                        "rendercount": cls.rendercount+1})
        return output != 0

    @classmethod
    def preview_render_availability(cls, entityid, band1, band2, band3):
        """
        Check if given preview image is already rendered.
        """
        try:
            output = DBSession.query(cls).filter(cls.entityid == entityid,
                                                 cls.band1 == band1,
                                                 cls.band2 == band2,
                                                 cls.band3 == band3,
                                                 cls.rendertype == 'preview',
                                                 cls.previewurl.isnot(None)).count()
        except:
            print 'Database query failed'
            return None
        if output != 0:
            # if this scene/band has already been requested, increase the count
            DBSession.query(cls).filter(cls.entityid == entityid,
                                        cls.band1 == band1,
                                        cls.band2 == band2,
                                        cls.band3 == band3,
                                        cls.rendertype == 'preview').update({
                                        "rendercount": cls.rendercount+1})

        return output != 0
