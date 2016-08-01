var express = require('express');
var app = express();

var bson = require('bson')
var BSON = new bson.BSONPure.BSON()
var Long = bson.BSONPure.Long

var MongoClient = require('mongodb').MongoClient;
var Binary = require('mongodb').Binary;
ObjectID = require('mongodb').ObjectID

// Connection URL
var url = 'mongodb://localhost:27017/calculus_questions';

app.get('/', function (req, res) {
      res.send('Hello World!');
});

app.get('/image', function( req, res) {
    var options = {
        root: __dirname,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    res.sendFile('limit.png', options, function(err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', 'limit.png');
        }
    });
});

app.get('/db_image', function(req, res) {
    MongoClient.connect(url, function(err,db) {
        console.log("Connected successfully to server");
        var collection = db.collection('question-collection');
        var newObjectId = new ObjectID.createFromHexString("5782412affbf64df5fdcf1f6");
        collection.find({'_id': newObjectId}).toArray(function(err, docs) {
            console.log(docs);
            // var newBuffer = Buffer.from(docs['png_image']);
            // var img = Binary(newBuffer);
            // var img = new Buffer(docs['png_image'], 'base64');

            var img = Binary(docs[0]['png_image']);

            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length
            });
            res.end(img);
            // res.send(Binary(docs[0]['png_image']));
            db.close();
        });
    });
});

app.listen(3000, function () {
      console.log('Example app listening on port 3000!');
});
