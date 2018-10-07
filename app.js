var express = require('express'),
	app = express(),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	config = require('./config/config.js'),
	ConnectMongo = require('connect-mongo')(session);
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	rooms = []

	var mongoose = require('mongoose');
	const connect = mongoose.connect(config.dbURL)
	 

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));	
app.set('view engine','html');
app.use(express.static(path.join(__dirname, '../images'))); // This is were ur going to add the path of the css documents
app.use(cookieParser());
app.use(session({secret:'frankenstein', saveUninitialized:true, resave:true}));
var env = process.env.NODE_ENV || 'development';
if (env === 'development'){
	// dev specific settings
	app.use(session({secret:config.sessionSecret}))
} else{
	// production specific settings 
	app.use(session({
		secret:config.sessionSecret,
		store: new ConnectMongo({
			url:config.dbURL,
			//mongoose_connection:mongoose.connections[0],
			stringify : true
		})
	}))
}




// passport initilizer and deinitilizer for the session DB
app.use(passport.initialize());
app.use(passport.session());

require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);
require('./routes/routes.js')(express, app, passport, config, rooms);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// Requiring socket .io
require('./socket/socket.js')(io, rooms);
//app.listen(3000, function(){
//	console.log('Frankchat working on port 3000');
//	console.log('Mode: ' + env);
//})

app.set('port', process.env.PORT || 3000);


server.listen(app.get('port'), function(){
	console.log('Frankchat on port : ' + app.get('port'));
})