var express = require('express');
var request = require('request');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.get('/',function(req,res){
  res.send('shubham');
});
app.get('/nextstation',function(req,res){
  var i=0;
  var key = "cmd6bebf4c";
  var tno = "19665";
  var date = "05-01-2018";
  var url = "https://api.railwayapi.com/v2/live/train/"+ tno +"/date/"+date+"/apikey/"+key;
  request({url:url,json:true}, function(error , response , body){
    console.log('error:',error);
    console.log('statusCode:',response && response.statusCode);
    var data = JSON.parse(JSON.stringify(body));
    var rt = data.route;
    for(i=0; i<rt.length ; i++){
      if(rt[i].has_departed===false){
        break;
      }
    }
    res.send(rt[i].station.name);
  });
});
var port = 8080;
app.listen(port,function(){
  console.log('web app is listening at port ' + port);
});
