from flask import render_template
from flask import Blueprint


main = Blueprint('todo', __name__)


@main.route('/')
def index():
    return render_template('todo_index.html')
