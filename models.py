from flask import Flask
from flask_sqlalchemy import SQLAlchemy

import time



app = Flask(__name__)
app.secret_key = 'secret key'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data2.db'

db = SQLAlchemy(app)


class ModelHelper(object):
    """
    这个类用来给 Model 添加几个共用方法
    """
    def __repr__(self):
        """
        __repr__ 是一个魔法方法
        简单来说, 它的作用是得到类的 字符串表达 形式
        比如 print(u) 实际上是 print(u.__repr__())
        """
        classname = self.__class__.__name__
        properties = ['{}: ({})'.format(k, v) for k, v in self.__dict__.items()]
        s = '\n'.join(properties)
        return '< {}\n{} \n>\n'.format(classname, s)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()



class Todo(db.Model, ModelHelper):
    __tablename__ = 'todos'

    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String())
    created_time = db.Column(db.Integer, default=0)
    complete = db.Column(db.Boolean)


    def __init__(self, form):
        self.task = form.get('task', '')
        self.created_time = int(time.time())
        self.complete = False

    def update(self, task):
        self.task = task
        self.save()
        return True

    def change_status(self):
        self.complete = not self.complete
        self.save()
        return True

    def remove(self):
        self.delete()
        return True

    def valid(self):
        return len(self.task) > 0

    def error_message(self):
        if len(self.task) < 0:
            return '任务不能为空'

    def json(self):
        d = dict(
            id=self.id,
            task=self.task,
            created_time=self.created_time,
            complete=self.complete
        )
        return d




def init_db():
    db.drop_all()
    db.create_all()
    print('rebuild database')


if __name__ == '__main__':
    init_db()
