var AV = require('leanengine');

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('ahello', function(request) {
  return 'Hello world!';
})

AV.Cloud.define('averageStars', function(request, response) {
  var query = new AV.Query('Review');
  query.equalTo('movie', request.params.movie);
  query.find().then(function(results) {
    var sum = 0;
    for (var i = 0; i < results.length; i++ ) {
      sum += results[i].get('stars');
    }
    response.success(sum / results.length);
  }).catch(function(error) {
    response.error('查询失败');
  });
});


AV.Cloud.afterSave('_User', function(request) {
  console.log(request.object);
  request.object.set('from','LeanCloud');
  return request.object.save().then(function(user)  {
    console.log('ok!');
  });
});

AV.Cloud.onIMConversationStarted((request) => {
    let params = request.params;
    console.log('params', params);

    // 在云引擎中打印的日志如下：
    // params {
    //     convId: '5789a33a1b8694ad267d8040',
    //     __sign: '1472723167361,f5ceedde159408002fc4edb96b72aafa14bc60bb'
    // }
});

AV.Cloud.onLogin(function(request) {
  // 因为此时用户还没有登录，所以用户信息是保存在 request.object 对象中
  console.log("on login:", request.object);
  if (request.object.get('username') == 'b') {
    // 如果是 error 回调，则用户无法登录（收到 401 响应）
    throw new AV.Cloud.Error('Forbidden');
  }
});
