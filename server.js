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
var port = 8080;
app.listen(port,function(){
  console.log('web app is listening at port ' + port);
})
