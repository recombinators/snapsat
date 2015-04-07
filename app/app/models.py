import transaction
from sqlalchemy import (Column, Integer, Boolean, UnicodeText, func, DateTime,
                        Float, or_, and_, )
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from zope.sqlalchemy import ZopeTransactionExtension
from datetime import datetime

Session = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()


class Paths(Base):
    """
    Model for paths table.
    """
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
            scene = (Session.query(cls).filter(
                func.ST_Within(func.ST_SetSRID(
                    func.ST_MakePoint(float(lon), float(lat)), 4236),
                    func.ST_SetSRID(cls.geom, 4236)), cls.mode == u'D').all()
                    )
            return scene
        except:
            return u'----'


class PathRow(Base):
    """
    Model for AWS S3 path and row list.
    """
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
        return Session.query(cls).filter(or_(*new))


class UserJob(Base):
    """
    Model for the user job queue. Possible job statuses:
    status_key = {0: "In queue",
                  1: "Downloading",
                  2: "Processing",
                  3: "Compressing",
                  4: "Uploading to server",
                  5: "Done",
                  10: "Failed"}
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
                band1=4, band2=3, band3=2,
                jobstatus=0,
                starttime=datetime.utcnow(),
                rendertype=rendertype
                ):
        """
        Create new job in db.
        """
        try:
            session = Session
            current_time = datetime.utcnow()
            job = UserJob(
                    entityid=entityid,
                    band1=band1, band2=band2, band3=band3,
                    jobstatus=0,
                    starttime=current_time,
                    lastmodified=current_time,
                    rendertype=rendertype)
            session.add(job)
            session.flush()
            session.refresh(job)
            pk = job.jobid
            transaction.commit()
            transaction.begin()
        except:
            return None

        try:
            RenderCache.add(pk, True, rendertype)
        except:
            print 'Could not add the job to the Rendered database.'
        return pk

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
            status = Session.query(cls.jobstatus).filter(
                cls.jobid == jobid).one()
            print status
        except:
            print 'Database write failed.'
            return None

        return status_key[status[0]]

    @classmethod
    def job_status_and_times(cls, jobid):
        """
        Get status and times for jobid passed in.
        """
        status_key = {0: "In queue",
                      1: "Downloading",
                      2: "Processing",
                      3: "Compressing",
                      4: "Uploading to server",
                      5: "Done",
                      10: "Failed"}
        try:
            job_info = Session.query(
                    cls.jobstatus,
                    cls.starttime,
                    cls.lastmodified).filter(
                        cls.jobid == jobid).one()
            return status_key[job_info[0]], job_info[1], job_info[2]
        except:
            print 'Database operation'


class RenderCache(Base):
    """
    Model for the already render_cache table.
    """
    __tablename__ = 'render_cache'
    id = Column(Integer, primary_key=True)
    jobid = Column(Integer)
    entityid = Column(UnicodeText)
    band1 = Column(Integer)
    band2 = Column(Integer)
    band3 = Column(Integer)
    renderurl = Column(UnicodeText)
    rendercount = Column(Integer, default=0)
    currentlyrend = Column(Boolean)
    rendertype = Column(UnicodeText)

    @classmethod
    def add(cls, jobid, currentlyrend, rendertype):
        """
        Method adds entry into db given jobid and optional url.
        """
        jobQuery = Session.query(UserJob).get(jobid)
        job = RenderCache(
                entityid=jobQuery.entityid,
                jobid=jobid,
                band1=jobQuery.band1, band2=jobQuery.band2, band3=jobQuery.band3,
                currentlyrend=currentlyrend,
                rendertype=rendertype)

        Session.add(job)
        transaction.commit()

    @classmethod
    def update(cls, jobid, currentlyrend, renderurl):
        """
        Method updates entry into db given jobid and optional url.
        """
        try:
            Session.query(cls).filter(cls.jobid == jobid).update({
                "currentlyrend": currentlyrend, "renderurl": renderurl})
        except:
            print 'could not update db'

    @classmethod
    def get_rendered_rendering(cls, entityid):
        """
        Return list of existing jobs for a given sceneID.
        """
        try:
            rendered = Session.query(cls).filter(
                    cls.entityid == entityid,
                    cls.currentlyrend is not True).all()
        except:
            print 'Database query failed get_rendered_rendering'
            return None
        return rendered

    @classmethod
    def full_render_availability(cls, entityid, band1, band2, band3):
        """
        Check if given image is already rendered.
        """
        try:
            output = Session.query(cls).filter(
                    cls.entityid == entityid,
                    cls.band1 == band1, cls.band2 == band2, cls.band3 == band3,
                    cls.rendertype == u'full',
                    cls.renderurl.isnot(None)).count()
        except:
            print 'Database query failed full_render_availability'
            return None

        if output != 0:
            # if this scene/band has already been requested, increase the count
            Session.query(cls).filter(
                    cls.entityid == entityid,
                    cls.band1 == band1, cls.band2 == band2, cls.band3 == band3,
                    cls.rendertype == u'full'
                    ).update({"rendercount": cls.rendercount+1})

        return output != 0

    @classmethod
    def preview_render_availability(cls, entityid, band1, band2, band3):
        """
        Check if given preview image is already rendered.
        """
        try:
            output = Session.query(cls).filter(
                    cls.entityid == entityid,
                    cls.band1 == band1, cls.band2 == band2, cls.band3 == band3,
                    cls.rendertype == u'preview',
                    cls.renderurl.isnot(None)).count()
        except:
            print 'Database query failed preview_render_availability'
            return None

        if output != 0:
            # if this scene/band has already been requested, increase the count
            Session.query(cls).filter(
                    cls.entityid == entityid,
                    cls.band1 == band1, cls.band2 == band2, cls.band3 == band3,
                    cls.rendertype == u'preview'
                    ).update({"rendercount": cls.rendercount+1})

        return output != 0
