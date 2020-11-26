from .base import db


class Setting(db.Model):
    key = db.Column(db.String(50), primary_key=True)
    value = db.Column(db.Text, nullable=True)


class SemesterMapping(db.Model):
    sem = db.Column(db.String(50), primary_key=True)
    file = db.Column(db.Text)
