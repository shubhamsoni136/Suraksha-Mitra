var express = require('express');
var request = require('request');
var morgan = require('morgan');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
app.use(session({
    secret: 'somerandomstringvalue',
    cookie: {maxAge : 1000 * 60 * 60 * 24 * 30}
}));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended:false}));
app.get('/',function(req,res){
  res.send('shubham');
});
app.post('/nextstation',function(req,res){
  var i=0;
  var key = "cmd6bebf4c";
  var tno = "19665";
  var date = "07-01-2018";
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
app.post('/sign_up',function(req,res){
  var name = req.body.name;
  var phone = req.body.phone;
  var aadhar = req.body.aadhar;
  var email = req.body.email;
  var pnr = req.body.pnr;
  var train_no = req.body.train_no;
  var seat = req.body.seat;
  var coach = req.body.coach;
  var eme = req.body.eme;
  var password = req.body.password;
  request({url:"https://data.club87.hasura-app.io/v1/query",json:true,method:"POST",
  headers:{
    "Content-Type": "application/json",
    "Authorization": "Bearer 6dd03e351413f121452be182d46a06fd4a3eb299e6c5f1bd"
  },
  body:{
    "type": "insert",
    "args": {
        "table": "passenger",
        "objects": [
            {
                "name": "vivek",
                "phone_no": "9982492369",
                "aadhar_no": "111111111111",
                "Email": "kls@gmail.com",
                "password": "kl@123",
                "pnr_no": "12345",
                "train_no": "19225",
                "emergency": "9546454342"
            }
        ]
    }
  }
  }, function(error , response , body){
    console.log('error:',error);
    console.log('statusCode:',response && response.statusCode);
    res.send(body);
  });
});
app.post('/login',function(req,res){
  var aadhar = req.body.aadhar;
  var pass = req.body.pass;
  request({url:"https://data.club87.hasura-app.io/v1/query",json:true,method:"POST",
  headers:{
    "Content-Type": "application/json",
    "Authorization": "Bearer 6dd03e351413f121452be182d46a06fd4a3eb299e6c5f1bd"
  },
  body:{
    "type": "select",
    "args": {
        "table": "passenger",
        "columns": [
            "password",
            "id"
        ],
        "where": {
            "aadhar_no": {
                "$eq": aadhar
            }
        }
    }
  }
  }, function(error , response , body){
    console.log('error:',error);
    console.log('statusCode:',response && response.statusCode);
    var dbstring = JSON.parse(JSON.stringify(body))[0];
    var dpass  = dbstring.password;
    if(dpass===pass){
      req.session.auth == {userId:dbstring.id};
      res.send("login successfully");
    }else{
      res.status(403).send("aadhar/password invalid");
    }
  });
});
app.post('/register_fir',function(req,res){
  var aadhar = req.body.aadhar;
  var subject = req.body.subject;
  var details = req.body.details;
  var i=0;
  var key = "cmd6bebf4c";
  var tno = req.body.train_no;
  var date = req.body.date;
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
    var result = rt[i].station.name;
    request({url:"https://data.club87.hasura-app.io/v1/query",json:true,method:"POST",
    headers:{
      "Content-Type": "application/json",
      "Authorization": "Bearer 6dd03e351413f121452be182d46a06fd4a3eb299e6c5f1bd"
    },
    body:{
      "type": "insert",
      "args": {
          "table": "fir",
          "objects": [
              {
                  "subject": subject,
                  "details": details,
                  "aadhar_no": aadhar,
                  "address" : result
              }
          ]
        }
      }
    }, function(error , response , body){
      console.log('error:',error);
      console.log('statusCode:',response && response.statusCode);
      if(response.statusCode === 200){
        res.send("fir registered successfully");
      }else{
        res.send(body);
      }
    });
  });

});
app.post('/vehicle',function(req,res){
var type = req.body.type;
var i=0;
var key = "cmd6bebf4c";
var tno = req.body.tno;
var date = req.body.date;
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
  var result = rt[i].station.name;
  request({url:"https://data.club87.hasura-app.io/v1/query",json:true,method:"POST",
  headers:{
    "Content-Type": "application/json",
    "Authorization": "Bearer 6dd03e351413f121452be182d46a06fd4a3eb299e6c5f1bd"
  },
  body:{
    "type": "select",
    "args": {
        "table": "vehicle",
        "columns": [
            "phone_no"
        ],
        "where": {
            "address": {
                "$eq": result
            }
        }
      }
    }
  }, function(error , response , body){
    console.log('error:',error);
    console.log('statusCode:',response && response.statusCode);
    if(response.statusCode === 200){
      var k = JSON.parse(JSON.stringify(body))[0];
      res.send(JSON.stringify(k.phone_no));
    }else{
      res.send(body);
    }
  });
});
});
var port = 8080;
app.listen(port,function(){
  console.log('web app is listening at port ' + port);
});
