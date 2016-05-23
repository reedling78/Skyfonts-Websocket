/*global require, dirname*/

var express = require('express'),
    app = express(),
    exphbs  = require('express-handlebars'),
    port = 5080;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/public', express.static('public'));

app.get('/', function (req, res) {
    'use strict';
    res.render('home');
});

app.listen(port);

console.log('Listening on http://localhost:' + port);
