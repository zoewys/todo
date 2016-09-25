var log = function(){
    console.log.apply(this, arguments)
}

var api = {};

api.ajax = function(url, method, form, callback) {
  var request = {
    url: url,
    type: method,
    data: form,
    success: function(response){
      var r = JSON.parse(response)
      if(r.success){
        callback(null, r.data)
      }else{
        callback(r.message)
      }
    },
    error: function(err){
      log('网络错误', err)
      var r = {
        success: false,
        message: '网络错误'
      }
      callback(r)
    }
  };
  $.ajax(request);
};

api.get = function(url, cb) {
  api.ajax(url, 'get', {}, cb)
}

api.post = function(url, form, cb) {
  api.ajax(url, 'post', form, cb)
}


api.todoGet = function(cb){
    var url = '/api/todo/list';
    api.get(url, cb)
}

api.todoAdd = function(form, cb){
    var url = '/api/todo/add';
    api.post(url, form, cb)
}

api.todoEdit = function(form, cb){
    var url = '/api/todo/update/' + form.id
    api.post(url, form, cb)
}

api.todoRemove = function(id, cb){
    var url = '/api/todo/remove/' + id
    api.get(url, cb)
}