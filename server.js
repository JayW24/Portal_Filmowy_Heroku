const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
//added stuff
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
//end of added stuff

//added stuff part 2
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
// end of added stuff part 2

// added stuff part 3
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
// end of added stuff part 3

// added stuff part 4 - here's where it crashes
// Middleware
app.engine('hbs', hbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
// var sessionMiddleware = session({
// 	secret: crypt.randomBytes(16).toString("hex"),
// 	cookie: { maxAge: 604800000 },	// = one week
// 	resave: false,
// 	saveUninitialized: true,
// 	maxAge: new Date(Date.now() + 3600000),
// 	store: new MongoStore({ mongooseConnection: mongoose.connection })
// });
// app.use(sessionMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
//end of added stuff part 4

//added stuff part 5
// Passport.js
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
	done(null, user.id)
});
passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		//dbLog('Deserialize User.', 'findById()', 'users', 'by id', user)
		done(err, user)
	})
});
//end of added stuff part 5

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

//dbquery test

function collectionNotAllowed(req, res, next) {
	if (req.params.dbName !== "messages" && req.params.dbName !== "users" && req.params.dbName !== "sessions" && req.params.dbName !== "confirmations") {
		next()
	}
	else {
		res.status(405).send("Not allowed to finish this action.")
	}
}

app.get('/api/dbquery/:dbname/:skip?/:limit?/:query?', collectionNotAllowed, async (req, res, next) => {
	try {
		serverLog(req, 'Universal GET')
		const dbname = req.params.dbname,
			skip = parseInt(req.params.skip),
			limit = parseInt(req.params.limit),
			query = req.params.query																		//to prevent access to all users Data
		if (query !== "null" && query !== undefined) {
			let decodedQueryParams = decodeQueryParams(query)
			//CATEGORIES
			if (decodedQueryParams['categories']) { (decodedQueryParams['categories']) = new RegExp((decodedQueryParams['categories']), 'i') }
			//NAME
			if (decodedQueryParams['name']) { (decodedQueryParams['name']) = new RegExp((decodedQueryParams['name']), 'i') }
			//DURATION
			console.log(colors.FgGreen, '[Server]: decodedQueryParams: ' + decodedQueryParams)
			if (decodedQueryParams['duration']) {
				let duration = decodedQueryParams['duration'].split(',')
				duration = { $gt: parseInt(duration[0]), $lt: parseInt(duration[1]) }
				decodedQueryParams['duration'] = duration
			}
			//ORDER
			if (decodedQueryParams['order']) {
				var order = decodedQueryParams['order']
				order = decodeOrderParams(order)
				delete decodedQueryParams['order']
			}
			else {
				order = null
			}

			const items = await db.collection(dbname).find(decodedQueryParams).skip(skip).limit(limit).sort(order).toArray()	//example: /api/dbquery/filmy/0/10/categories=cat1&order=name:1
			dbLog('Got results from DB!', 'find()', dbname, decodedQueryParams, items)
			res.send(items)
		}
		else {
			const items = await db.collection(dbname).find().skip(skip).limit(limit).sort().toArray()
			dbLog('Got results from DB!', 'find()', dbname, null, items)
			res.send(items)
		}
	}
	catch (err) {
		next(err)
	}
})
//end of dbquery test

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// ************************************************* START SERVER + DATABASE CONNECTIONS ***********************************************
// Start Mongoose 
mongodb.MongoClient.connect(connectionString, connectionOptions, function (err, database) {
	if (err) {
		console.log(colors.FgRed, '[Database]: Mongo Client connection error!' + error)
	}
	db = database.db('portal_filmowy')

	// Start MongoDB Client
	mongoose.connect(connectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
		.catch(error =>
			console.log(colors.FgRed, '[Database]: mongoose connection error!' + error
			))

	// Start Server
	server.listen(port, () => {
		console.log(colors.FgCyan, '\n*\n*\n*\n*\n*\n*\n')
		console.log(colors.FgYellow, '[Database]: database connected! Mongo Client and Mongoose are ready.')
		console.log(colors.FgBlue, `[Server]: server started. Listening on port *:${port}`)
	}).on('error', (err) => {
		console.log(colors.FgRed, '[Server]: Server listen error!')
		console.log(err)
	})
});