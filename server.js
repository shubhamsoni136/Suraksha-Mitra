var express = require('express');
var request = require('request');
var morgan = require('morgan');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
app.use(session({
    secret: 'somerandomstringvalue',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
}));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.get('/', function(req, res) {
    res.send('shubham');
});
app.post('/nextstation', function(req, res) {
    var i = 0;
    var key = "cmd6bebf4c";
    var tno = "19665";
    var date = "07-01-2018";
    var url = "https://api.railwayapi.com/v2/live/train/" + tno + "/date/" + date + "/apikey/" + key;
    request({
        url: url,
        json: true
    }, function(error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        var data = JSON.parse(JSON.stringify(body));
        var rt = data.route;
        for (i = (rt.length - 1); i >= 0; i--) {
            if (rt[i].has_departed === true && rt[i].has_arrived === true) {
                break;
            }
        }
        res.send(rt[i + 1].station.name);
    });
});
app.post('/sign_up', function(req, res) {
    var name = req.body.name;
    var phone = req.body.phone;
    var aadhar = req.body.aadhar;
    var email = req.body.email;
    var eme = req.body.eme;
    var password = req.body.password;
    request({
        url: "https://data.club87.hasura-app.io/v1/query",
        json: true,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 6dd03e351413f121452be182d46a06fd4a3eb299e6c5f1bd"
        },
        body: {
            "type": "insert",
            "args": {
                "table": "passenger",
                "objects": [{
                    "name": name,
                    "phone_no": phone,
                    "aadhar_no": aadhar,
                    "Email": email,
                    "password": password,
                    "emergency": eme,

                }]
            }
        }
    }, function(error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        res.send(body);
    });
});
app.post('/login', function(req, res) {
    var aadhar = req.body.aadhar;
    var pass = req.body.pass;
    request({
        url: "https://data.club87.hasura-app.io/v1/query",
        json: true,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 6dd03e351413f121452be182d46a06fd4a3eb299e6c5f1bd"
        },
        body: {
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
    }, function(error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        var dbstring = JSON.parse(JSON.stringify(body))[0];
        var dpass = dbstring.password;
        if (dpass === pass) {
            req.session.auth == {
                userId: dbstring.id
            };
            res.send("login successfully");
        } else {
            res.status(403).send("aadhar/password invalid");
        }
    });
});
app.post('/registerfir', function(req, res) {
    var result;
    var i = 0;
    var key = "cmd6bebf4c";
    var aadhar = req.body.aadhar;
    var subject = req.body.subject;
    var details = req.body.details;
    var tno = req.body.tno;
    var pnr = req.body.pnr;
    var seat = req.body.seat;
    var coach = req.body.coach;
    var date = req.body.date;
    var url = "https://api.railwayapi.com/v2/live/train/" + tno + "/date/" + date + "/apikey/" + key;
    request({
        url: url,
        json: true
    }, function(error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        var data = JSON.parse(JSON.stringify(body));
        var rt = data.route;
        for (i = (rt.length - 1); i >= 0; i--) {
            if (rt[i].has_departed === true && rt[i].has_arrived === true) {
                break;
            }
        }
        if (rt.length !== 0 || i !== rt.length) {
            result = rt[i + 1].station.name;
            request({
                url: "https://data.club87.hasura-app.io/v1/query",
                json: true,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer 6dd03e351413f121452be182d46a06fd4a3eb299e6c5f1bd"
                },
                body: {
                    "type": "insert",
                    "args": {
                        "table": "fir",
                        "objects": [{
                            "aadhar_no": aadhar,
                            "subject": subject,
                            "details": details,
                            "station": result,
                            "train_no": tno,
                            "coach_no": coach,
                            "seat": seat,
                            "pnr": pnr
                        }]
                    }
                }
            }, function(error, response, body) {
                console.log('error:', error);
                console.log('statusCode:', response && response.statusCode);
                res.send(body);
            });
        } else {
            res.send("not found");
        }
    });
});

app.post('/vehicle', function(req, res) {
    var i = 0;
    var type = req.body.type;
    var key = "cmd6bebf4c";
    var tno = req.body.tno;
    var date = req.body.date;
    var result;
    var url = "https://api.railwayapi.com/v2/live/train/" + tno + "/date/" + date + "/apikey/" + key;
    request({
        url: url,
        json: true
    }, function(error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        var data = JSON.parse(JSON.stringify(body));
        var rt = data.route;
        for (i = (rt.length - 1); i >= 0; i--) {
            if (rt[i].has_departed === true && rt[i].has_arrived === true) {
                break;
            }
        }
        if (rt.length !== 0 && i !== rt.length) {
            result = rt[i + 1].station.name;
            request({
                url: "https://data.club87.hasura-app.io/v1/query",
                json: true,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer 6dd03e351413f121452be182d46a06fd4a3eb299e6c5f1bd"
                },
                body: {
                    "type": "select",
                    "args": {
                        "table": "vehicle",
                        "columns": [
                            "phone_no"
                        ],
                        "where": {
                            "$and": [{
                                    "address": {
                                        "$eq": result
                                    }
                                },
                                {
                                    "type": {
                                        "$eq": type
                                    }
                                }
                            ]
                        }
                    }
                }
            }, function(error, response, body) {
                console.log('error:', error);
                console.log('statusCode:', response && response.statusCode);
                if (body.length !== 0) {
                    res.send(JSON.stringify(body[0].phone_no));
                } else {
                    res.send("data not available");
                }
            });
        }
    });
});
app.get('/emecontact', function(req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        request({
            url: "https://data.club87.hasura-app.io/v1/query",
            json: true,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer 6dd03e351413f121452be182d46a06fd4a3eb299e6c5f1bd"
            },
            body: {
                "type": "select",
                "args": {
                    "table": "passenger",
                    "columns": [
                        "emergency"
                    ],
                    "where": {
                        "id": {
                            "$eq": req.session.auth.userId
                        }
                    }
                }
            }
        }, function(error, response, body) {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
            if (body.length !== 0) {
                res.send(JSON.stringify(body[0].emergency));
            } else {
                res.send("data not available");
            }
        });
    } else {
        res.send("login first");
    }
});
var port = 8080;
app.listen(port, function() {
    console.log('web app is listening at port ' + port);
});
