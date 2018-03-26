var AV = require('leanengine');
//dev
//var API_URL='http://125.227.43.46:8681/api/im/';
//QA
var API_URL='http://125.227.43.46:8692/api/im/';
//boss
//var API_URL='http://125.227.43.46:8682/api/im/';
//azure
//var API_URL='https://api-admintool.jsti-ea-ase.p.azurewebsites.net/api/im/';
/**
 * 一个简单的云代码方法
 */
//AV.Cloud.define('ahello', function(request) {
//  return 'Hello world!';
//})


AV.Cloud.afterSave('_User', function(request) {
  console.log(request.object);
  request.object.set('from','LeanCloud');
  return request.object.save().then(function(user)  {
    console.log('ok!');
  });
});

//AV.Cloud.onIMConversationStarted((request) => {
//    let params = request.params;
    //console.log('params', params);

    // 在云引擎中打印的日志如下：
    // params {
    //     convId: '5789a33a1b8694ad267d8040',
    //     __sign: '1472723167361,f5ceedde159408002fc4edb96b72aafa14bc60bb'
    // }
//});

AV.Cloud.onIMMessageReceived((request) => {
    var sync_request=require('sync-request');
    let content = request.params.content;
    var processedContent=content;
    var tmp_content=JSON.parse(content);
    var check=0;
    console.log('***Start***');
    console.log('1.Content List:',request.params);
    if(tmp_content._lctype<0){
        //black list
        if(request.params.toPeers[0] != undefined){
            let url_group=API_URL+'get-group-by-convid?';
            url_group=url_group+"convid="+request.params.convId;
            var sync_group=sync_request('GET', url_group);
            var group_body=JSON.parse(sync_group.getBody());
            var is_group=group_body.data;

            //check group
            if(is_group=="true"){
                check=1;
            }else{
                let url_blacklist=API_URL+'sender-validity-check?';
                url_blacklist=url_blacklist+"senderMemberId="+request.params.fromPeer;
                if(tmp_content._lcattrs!=undefined){
                    if(tmp_content._lcattrs.conversationType=="0"){
                        url_blacklist=url_blacklist+"&recipientMemberId="+request.params.toPeers[0];
                    }
                }else{
                    url_blacklist=url_blacklist+"&recipientMemberId="+request.params.toPeers[0];
                }
                let res_blacklist=sync_request('GET', url_blacklist);
                if(res_blacklist.statusCode==400){
                    console.log('  > error code:400 account does not exist!',url_blacklist);
                    console.log('***End***');
                    return{
                        drop: true,
                        code: 4000
                    };
                }
                let getUrlData_blacklist=JSON.parse(res_blacklist.getBody());
                if(getUrlData_blacklist.data>0){
                    console.log('  > errer code:',1000+getUrlData_blacklist.data,url_blacklist);
                    console.log('***End***');
                    return{
                        drop: true,
                        code: 1000+getUrlData_blacklist.data
                    };
                }else{
                    check=1;
                }
            }
        }
    }

    if(tmp_content._lctype<0 && request.params.toPeers[0] != undefined && check==0){
       console.log('  > error code:1999!',url_blacklist);
       console.log('***End***');
             return{
             drop: true,
             code: 1999
       };
    }
    //censored words
    let url=API_URL+'censored-words';
    let res = sync_request('GET', url);
    let getUrlData=JSON.parse(res.getBody()).data;
    getUrlData.map(function(w){
         processedContent=processedContent.replace(w,"**");
    })
    console.log("2.Processed Content:",processedContent);
    console.log('***End***');
  return{
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


