const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require("body-parser")
const port = process.env.PORT || 5000;
const connectionOptions = { poolSize: process.env.MONGO_POOLSIZE || 1 }
const mongodb = require('mongodb')
const cors = require('cors')
const busboy = require('connect-busboy');
const http = require('http');
const server = http.createServer(app);
const colors = require('./colorfulLogs').colors;
const connectionString = require('./credentials').connectionString;
var multer = require('multer');
var	cookieParser = require('cookie-parser');
var	crypt = require('crypto');
var	db;
var	fs = require('fs-extra');
var	io = require("socket.io")(server)
		.use(function (socket, next) {
			// Wrap the express middleware
			sessionMiddleware(socket.request, {}, next);
		})

app.use(busboy());
app.use(cors());
global.bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
	extended: true,
	limit: '50mb',
	parameterLimit: 100000
}));
app.use(bodyParser.json({
	limit: '50mb',
	parameterLimit: 100000
}));

const { fork } = require('child_process')	// for multi thread

	// Mongoose Schemas
const Schemas = require('./schemas');
const User = Schemas.User;
const Film = Schemas.Film;
const Series = Schemas.Series;
const Actor = Schemas.Actor;
const Premiere = Schemas.Premiere;
const Comment = Schemas.Comment;
const Rating = Schemas.Rating;
const Message = Schemas.Message;
const News = Schemas.News;
const SearchItem = Schemas.SearchItem;

	// Passport JS
var	session = require('express-session')
var	hbs = require('express-handlebars')
var	mongoose = require('mongoose')
var	passport = require('passport')
var	localStrategy = require('passport-local').Strategy
var	bcrypt = require('bcrypt')
var	{ resolveNaptr } = require('dns')
var	{ query } = require('express')
var	{ request } = require('http')
const { setTimeout } = require('timers/promises')

var MongoStore = require('connect-mongo')(session);

// Middleware
// app.engine('hbs', hbs({ extname: '.hbs' }));
// app.set('view engine', 'hbs');
// app.use(express.static(__dirname + '/public'));
// var sessionMiddleware = session({
// 	secret: crypt.randomBytes(16).toString("hex"),
// 	cookie: { maxAge: 604800000 },	// = one week
// 	resave: false,
// 	saveUninitialized: true,
// 	maxAge: new Date(Date.now() + 3600000),
// 	store: new MongoStore({ mongooseConnection: mongoose.connection })
// });
//app.use(sessionMiddleware);
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(cookieParser());

// Passport.js
// app.use(passport.initialize());
// app.use(passport.session());
// passport.serializeUser(function (user, done) {
// 	done(null, user.id)
// });
// passport.deserializeUser(function (id, done) {
// 	User.findById(id, function (err, user) {
// 		//dbLog('Deserialize User.', 'findById()', 'users', 'by id', user)
// 		done(err, user)
// 	})
// });

//
if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(path.join(__dirname, 'client/build')));
  
	// Handle React routing, return all requests to React app
	app.get('*', function(req, res) {
	  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
	});
  }
//


// API calls
app.get('/api/hello', (req, res) => {
	res.send({ express: 'Hello From Express' });
  });
  
  app.post('/api/world', (req, res) => {
	console.log(req.body);
	res.send(
	  `I received your POST request. This is what you sent me: ${req.body.post}`,
	);
  });
  

server.listen(port, () => {
	console.log(colors.FgCyan, '\n*\n*\n*\n*\n*\n*\n')
	console.log(colors.FgYellow, '[Database]: database connected! Mongo Client and Mongoose are ready.')
	console.log(colors.FgBlue, `[Server]: server started. Listening on port *:${port}`)
}).on('error', (err) => {
	console.log(colors.FgRed, '[Server]: Server listen error!')
	console.log(err)
})