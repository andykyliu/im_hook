var AV = require('leanengine');
var fetch = require('node-fetch');
var API_URL='http://125.227.43.46:8681/api/im/';
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
    //console.log('params', params);

    // 在云引擎中打印的日志如下：
    // params {
    //     convId: '5789a33a1b8694ad267d8040',
    //     __sign: '1472723167361,f5ceedde159408002fc4edb96b72aafa14bc60bb'
    // }
});

AV.Cloud.onIMMessageReceived((request) => {
    var url=API_URL+'censored-words';
    let params = request.params;
    let content = request.params.content;
    let processedContent;

    var sync_request=require('sync-request');
    let res = sync_request('GET', url);
    let getUrlData=JSON.parse(res.getBody()).data;
    console.log("processedContent",getUrlData);
    getUrlData.map(function(w){
        processedContent=content.replace(w,"**");
    })
    console.log("processedContent",processedContent);
  return
  {
    content: processedContent
  }
});


AV.Cloud.onLogin(function(request) {
  // 因为此时用户还没有登录，所以用户信息是保存在 request.object 对象中
  console.log("on login:", request.object);
  if (request.object.get('username') == 'b') {
    // 如果是 error 回调，则用户无法登录（收到 401 响应）
    throw new AV.Cloud.Error('Forbidden');
  }
});


