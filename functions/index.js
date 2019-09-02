const express = require('express')
var app = express();
var api = require('./api');
var bodyParser = require('body-parser');
var functions = require('firebase-functions')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use('/api/users', api);
app.set('port', process.env.PORT || 3000);
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port `);
});
exports.app = functions.https.onRequest(app);
