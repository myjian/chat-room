var express = require('express');
var logger = require('morgan');
var stylus = require('stylus');
var nib = require('nib');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Web Application settings
app.set('port', process.env.PORT || 5000);

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;
//app.use(logger('dev'));
app.use(stylus.middleware({
	src: __dirname + '/public',
	compile: compile
}
));

// Application Controllers
var items = require(__dirname + '/controllers/items');

/* expose files under 'public' folder */
app.use(express.static(__dirname + '/public'));

app.use(bodyParser());

app.get('/', function (req, res) {
	res.render('index', { title: 'Index' });
});

app.get('/items', items.list);

http.listen(app.get('port'), function(){
	console.log('listening on *:' + app.get('port'));
});

io.on('connection', function(socket){
	socket.on('chat message', function(msgObj){
		items.saveMsg(msgObj)
		socket.broadcast.emit('chat message', msgObj);
	});
});
