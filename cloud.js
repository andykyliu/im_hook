var AV = require('leanengine');
var API_URL='125.227.43.46';
var API_URL_PORT='8681';
/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('ahello', function(request) {
  return 'Hello world!';
})


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

AV.Cloud.onIMMessageReceived((request) => {
    let params = request.params;
    var http = require('http');
    var emp = [];
    var extServerOptions = {
        host: API_URL,
        port: API_URL_PORT,
        path: '/api/im/blacklist?memberId=90192197-5B09-E711-8D8E-000C2924F676',
        method: 'GET'
    };
    function get() {
        http.request(extServerOptions, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (data) {
                emp = JSON.parse(data);
                console.log(emp);
            });
         }).end();
    };
    get();




 let content = request.params.content;
    console.log('content', content);
    let processedContent = content.replace('XX中介', '**');
    console.log('content', processedContent);
    // 必须含有以下语句给服务端一个正确的返回，否则会引起异常
  return {
    content: processedContent
  };
});


AV.Cloud.onLogin(function(request) {
  // 因为此时用户还没有登录，所以用户信息是保存在 request.object 对象中
  console.log("on login:", request.object);
  if (request.object.get('username') == 'b') {
    // 如果是 error 回调，则用户无法登录（收到 401 响应）
    throw new AV.Cloud.Error('Forbidden');
  }
});
