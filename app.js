var express = require('express');
var app = express();

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

app.listen(3000, function () {
      console.log('Example app listening on port 3000!');
});
