  var sql = require('mssql');
  
   var config = {
       user: 'andyliu',
       password: 'andyliu123',
       server: '10.10.208.96', // WORKED
       database: 'LotteryBU'
   };
  
  sql.connect(config).then(function() {
 
  new sql.Request().query('select top 1 CurrencyCode from Currency').then(function(recordset) {
      console.dir(recordset);
      }).catch(function(err) {console.log(err); });
  }).catch(function(err) {console.log(err); });
