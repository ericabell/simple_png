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

app.get('/number_of_records', function(req, res) {
    MongoClient.connect(url, function(err,db) {
        console.log("Connected successfully to server");
        var collection = db.collection('question-collection');
        collection.find({'compile_success': 'False'}).toArray(function(err, docs) {
            res.send('Number of records with png image: ' + docs.length);
            db.close();
        });
    });
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

app.get('/questions', function(req,res) {
    MongoClient.connect(url, function(err,db) {
        console.log("Connected successfully to server");
        var collection = db.collection('question-collection');
        collection.find().toArray(function(err, docs) {
            res.send(docs);
            db.close();
        });
    });    
})

app.get('/db_image', function(req, res) {
    MongoClient.connect(url, function(err,db) {
        console.log("Connected successfully to server");
        var collection = db.collection('question-collection');
        var newObjectId = new ObjectID.createFromHexString("5796aee0abdbe4138c2757d2");
        collection.find({'_id': newObjectId}).toArray(function(err, docs) {
            console.log(docs);
            // var newBuffer = Buffer.from(docs['png_image']);
            // var img = Binary(newBuffer);
            // var img = new Buffer(docs['png_image'], 'base64');

            // var img = Binary(docs[0]['png_image']);
            var img = docs[0]['png_image']; // !!! img is of type Binary
            console.log(img.length);

            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length() // if this was just .length, we will get a server error/crash
            });
            res.end(img.buffer, 'binary');
            // res.send(Binary(docs[0]['png_image']));
            db.close();
        });
    });
});

app.get('/:questionId', function(req, res) {
  MongoClient.connect(url, function(err,db){
    console.log("Connected successfully to the database");
    var collection = db.collection('question-collection');
      // find the one document corresponding to the Object ID passed by GET
      var newObjectId = new ObjectID.createFromHexString(req.params.questionId);
      collection.find({'_id': newObjectId} ).toArray(function(err, docs) {
            var img = docs[0]['png_image']; // !!! img is of type Binary
            console.log(img.length);

            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length() // if this was just .length, we will get a server error/crash
            });
            res.end(img.buffer, 'binary');
            // res.send(Binary(docs[0]['png_image']));
            db.close();
        
        db.close();
      });
  });
});

app.get('/test', function(req, res) {
    MongoClient.connect(url, function(err,db) {
        console.log("Connected successfully to server");
        var collection = db.collection('question-collection');
        var newObjectId = new ObjectID.createFromHexString("5796aee0abdbe4138c2757d2");
        collection.find({'_id': newObjectId}).toArray(function(err, docs) {
            // console.log(docs);

            // var img = docs[0]['png_image']['buffer'];
            // res.writeHead(200, {
                // 'Content-Type': 'image/png',
                // 'Content-Length': img.length
            // });
            // res.end(Buffer(img));
            // console.log(img);

            res.send(docs);

            db.close();
        });
    });
});


app.listen(3000, function () {
      console.log('Example app listening on port 3000!');
});
