(function(){

    var todoTpl = function(todo){
        var t = todo
        var tpl = `
            <li>
                <input type="hidden" name="id" value="${t.id}" readonly>
                <input class="${t.complete?'del':''}" type="text" name="task" value="${t.task}" readonly>
                <button name="update" hidden>确认</button>
                <button name="edit">修改</button>
                <button name="remove">删除</button>
            </li>
        `

        return tpl
    }

    var toggleBtn = function($li){
        $li.find('button[name=update]').toggle()
        $li.find('button[name=edit]').toggle()
        $li.find('button[name=remove]').toggle()
    }


    var refreshTodo = function(){
        api.todoGet(function(err, data){
            if(err){
                alert('获取数据失败')
            }else{
                var s = ''
                data.forEach(function(item){
                    s = s + todoTpl(item)
                })
                $('#id-ul-todo').html(s)
            }
        })
    }

    var addTodo = function(){
        var t = {
            task: $('#id-input-task').val() || 'task'
        }
        api.todoAdd(t, function(err, data){
            if(err){
                alert('添加失败')
            }else{
                refreshTodo()
            }
        })
    }

    var editTodo = function($li){
        toggleBtn($li)
        $li.find('input[name=task]').removeAttr('readonly')
    }

    var updateTodo = function($li){
        var t = {
            task: $li.find('input[name=task]').val(),
            id: $li.find('input[name=id]').val()
        }
        api.todoEdit(t, function(err, data){
            if(err){
                alert('修改失败')
            }else{
                refreshTodo()
            }
        })
    }

    var removeTodo = function($li){
        var id = $li.find('input[name=id]').val()
        api.todoRemove(id, function(err, data){
            if(err){
                alert('删除失败')
            }else{
                refreshTodo()
            }
        })
    }

    var bindEvent = function(){
        //添加
        $('#id-button-add').on('click', function(){
            addTodo()
        });
        //修改
        $('#id-ul-todo').on('click', 'button[name=edit]', function(){
            editTodo($(this).parent('li'))
        });
        //确认
        $('#id-ul-todo').on('click', 'button[name=update]', function(){
            updateTodo($(this).parent('li'))
        });
        //删除
        $('#id-ul-todo').on('click', 'button[name=remove]', function(){
            removeTodo($(this).parent('li'))
        })
    }

    this._init = function(){
        refreshTodo()
        bindEvent()
    }
})(this)

$(document).ready(function(){
    _init()
});