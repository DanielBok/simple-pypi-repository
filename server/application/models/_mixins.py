from application.extensions import db


class ResourceMixin:
    @classmethod
    def bulk_insert(cls, data):
        db.session.flush()
        for d in data:
            db.session.add(d)

        db.session.commit()

        return cls

    def save(self):
        db.session.flush()
        db.session.add(self)
        db.session.commit()
        return self

    def delete(self) -> int:
        db.session.flush()
        db.session.delete(self)
        return db.session.commit()

    def __str__(self):
        obj_id = hex(id(self))
        columns = self.__table__.c.keys()
        values = ', '.join("%s=%r" % (n, getattr(self, n)) for n in columns)
        return '<%s %s(%s)>' % (obj_id, self.__class__.__name__, values)
