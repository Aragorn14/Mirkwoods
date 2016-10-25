var express = require('express');
var app = module.exports = express();
var db = require(DEFS.DIR.DB_CONNECT)('openshift');


app.get('/cms/homepage-images', function (req, res) {
    res.sendfile('cms-homepage-images.html', { "root": 'views/' });
});

