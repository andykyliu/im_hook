var AV = require('leanengine');
var request = require('request');
var URL='http://125.227.43.46:8681';
var API_URL=URL+'/api/im/';


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


 function api_get(api_func,callback) {
     var options = {
        uri : 'http://125.227.43.46:8681/api/im/censored-words',
        method : 'GET'
     };
    var res = '';
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
             res = body;
         }
         else {
             res = 'Not Found';
         }
         callback(res);
     });
 }


AV.Cloud.onIMMessageReceived((request) => {
    console.log('params',params);
    console.log('params.p',params.fromPeer);

//    api_get('censored-words', function(resp){
//        console.log(JSON.parse(resp));       
//    });


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

