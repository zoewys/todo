from flask import request
from flask import Blueprint

import json
from models import Todo


main = Blueprint('api', __name__)


def response_data(err, data):
    r = {
        "data": []
    }
    if err:
        r['success'] = False
        r['message'] = err
    else:
        r['success'] = True
        r['data'] = data

    return r


@main.route('/todo/list')
def get():
    todo_list = Todo.query.order_by(Todo.id.desc()).all()
    r = response_data(None, [t.json() for t in todo_list])

    return json.dumps(r, ensure_ascii=False)


@main.route('/todo/add', methods=['POST'])
def add():
    form = request.form
    t = Todo(form)
    if t.valid():
        t.save()
        r = response_data(None, t.json())
    else:
        r = response_data(t.error_message, '')

    return json.dumps(r, ensure_ascii=False)


@main.route('/todo/update/<int:todo_id>', methods=['POST'])
def update(todo_id):
    form = request.form
    t = Todo.query.get(todo_id)
    if Todo(form).valid():
        t.update(form.get('task', ''))
        r = response_data(None, t.json())
    else:
        r = response_data(t.error_message, '')

    return json.dumps(r, ensure_ascii=False)


@main.route('/todo/remove/<int:todo_id>')
def remove(todo_id):
    t = Todo.query.get(todo_id)
    t.remove()
    r = response_data(None, t.json())

    return json.dumps(r, ensure_ascii=False)