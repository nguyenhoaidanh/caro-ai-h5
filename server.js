const express = require('express')
var mongoose = require('mongoose');
var app = express();
var api = require('./api');;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('build/web-desktop'));
app.set('views', __dirname + '/views'); 
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
mongoose
	.connect("mongodb://caro:nguyenhoaidanh2019@ds137101.mlab.com:37101/caro", { useNewUrlParser: true })
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err));
app.get('/', (req, res) => {
	res.sendFile(__dirname+'/build/web-desktop/index.html')
});
app.use('/api/users', api);
app.set('port', process.env.PORT || 3000);
app.listen(process.env.PORT || 3000, () => {
	console.log(`Server started on port `);
});