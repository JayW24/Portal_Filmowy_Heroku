var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 5000;
var connectionOptions = { poolSize: process.env.MONGO_POOLSIZE || 1 }
var mongodb = require('mongodb')
var cors = require('cors')
var busboy = require('connect-busboy');
var http = require('http');
var server = http.createServer(app);
var colors = require('./colorfulLogs').colors;
var connectionString = require('./env/credentials').connectionString;
var multer = require('multer');
var cookieParser = require('cookie-parser');
var crypt = require('crypto');
var db;
var fs = require('fs-extra');
var io = require("socket.io")(server)
	.use(function (socket, next) {
		sessionMiddleware(socket.request, {}, next);
	})

// Passport JS
var session = require('express-session');
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var MongoStore = require('connect-mongo')(session);

// Mongoose Models
var Models = require('./models/models');
var {User, Film, Series, Actor, Premiere, Comment, Rating, Message, News, SearchItem} = Models;

// Middleware
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
app.engine('hbs', hbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
var sessionMiddleware = session({
	secret: crypt.randomBytes(16).toString("hex"),
	cookie: { maxAge: 604800000 },	// = one week
	resave: false,
	saveUninitialized: true,
	maxAge: new Date(Date.now() + 3600000),
	store: new MongoStore({ mongooseConnection: mongoose.connection })
});
app.use(sessionMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

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
})

// *********************************************************  PASSPORT JS ***************************************************************

passport.use(new localStrategy(async function (username, password, done) {
	try {
		const user = await User.findOne({ username: username });
		if (!user) return done(null, false, { message: 'Incorrect username.' });
		const res = await bcrypt.compare(password, user.password);
		if (res === false) return done(null, false, { message: 'Incorrect password.' });
		return done(null, user);
	}
	catch (err) {
		console.log(err);
	}
}))


// Use if there is a need to check if user is logged in for some action etc.
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		if (req.user.authorized) {
			next();
		}
		else {
			res.send('User not authorized. Check your e-mail.');
		}
	}
	else {
		res.send('User not logged in.');
	}
}

// Redirect if user is not logged in
function isLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) return next();
	res.redirect('/');
}

// When user is not allowed to fetch data
function collectionNotAllowed(req, res, next) {
	if (req.params.dbName !== "messages" && req.params.dbName !== "users" && req.params.dbName !== "sessions" && req.params.dbName !== "confirmations") {
		next();
	}
	else {
		res.status(405).send("Not allowed to finish this action.");
	}
}

// ROUTES

// Get Logged User Username
app.get('/api/loggedUserUsername', isLoggedIn, (req, res) => {
	serverLog(req, 'GET loggedUserUsername');
	res.send({ username: req.user.username, userID: req.user._id });
})

// Get Username of user by ID
app.get('/api/get-user-id/:username', async (req, res) => {
	console.log(colors.FgGreen, `[Server]: GET user-id called. Username: ${req.params.username}`);
	const username = await User.findOne({ username: req.params.username }, '_id');
	res.send(username);
	dbLog('GET user._id called!', 'findOne', 'users', JSON.stringify({ username: req.params.username }), username);
})

// Login user
app.get('/api/login', isLoggedOut, (req, res) => {
	console.log(colors.FgGreen, `[Server]: GET login form called.`);
	const response = {
		title: "Login",
		error: req.query.error
	};
	res.render('login', response);
})

// Logout user
app.get('/api/logout', function (req, res) {
	req.logout();
	res.redirect('/');
})

// Post user
app.post('/api/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login?error=true'
}))


// *************************** SETUP ADMIN ACCOUNT - RUN ONLY IF ADMIN ACCOUNT DOES NOT EXIST OR HAS BEEN REMOVED ***************************
/*
app.get('/setup', async (req, res) => {
	const exists = await User.exists({ username: "admin" });
	if (exists) {
		res.redirect('/login')
		return;
	};
	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err)
		bcrypt.hash("pass", salt, function (err, hash) {
			if (err) return next(err)
			const newAdmin = new User({
				username: "admin",
				password: hash
			});
			newAdmin.save()
			res.redirect('localhost/login')
		});
	});
});
*/

// *********************************************************  END OF PASSPORT JS ******************************************************

// *********************************************************     GMAIL API    *********************************************************
// RENEW TOKEN IF DOESN'T WORK -> /api/Renew-token.txt

const readline = require('readline');
const { google } = require('googleapis');
const { errorMonitor } = require('stream');
const SCOPES = [
		'https://mail.google.com/',
		'https://www.googleapis.com/auth/gmail.modify',
		'https://www.googleapis.com/auth/gmail.compose',
		'https://www.googleapis.com/auth/gmail.send'
	]
const TOKEN_PATH = './env/token.json';

function sendEmail(to, subject, emailContent) {
	const args = { to: to, subject: subject, emailContent: emailContent };
	console.log(colors.FgMagenta, '[Google Api]: sending email... Args:' + JSON.stringify(args));
	fs.readFile('./env/client_secret.json', (err, content) => {
		if (err) return console.log('Error loading client secret file:', err);
		// Authorize a client with credentials, then call the Gmail API.
		authorize(JSON.parse(content), sendMessage, to, subject, emailContent);
	});
}

function authorize(credentials, callback, to, subject, content) {
	let args = {
		credentials: credentials,
		callback: callback,
		to: to,
		subject: subject,
		content: content
	};
	console.log(colors.FgMagenta, '[Google Api]: authoriging... Args:' + JSON.stringify(args));
	const { client_secret, client_id, redirect_uris } = credentials.web;
	const oAuth2Client = new google.auth.OAuth2(
		client_id, client_secret, redirect_uris[0]);

	fs.readFile(TOKEN_PATH, (err, token) => {
		console.log(colors.FgMagenta, '[Google Api]: reading file... Token is: ' + token);
		if (err) return getNewToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(JSON.parse(token));
		callback(oAuth2Client, to, subject, content);
	});
}

function getNewToken(oAuth2Client, callback) {
	console.log(colors.FgMagenta, '[Google Api]: getting new token...');
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	})

	console.log(colors.FgMagenta, '[Google Api]: Authorize this app by visiting this url:', authUrl);

	const rl = readline.mappingeInterface({
		input: process.stdin,
		output: process.stdout,
	})

	rl.question('[Google Api]: Enter the code from that page here: ', (code) => {
		rl.close()
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return console.error('Error retrieving access token', err);
			oAuth2Client.setCredentials(token);
			// Store the token to disk for later program executions
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) return console.error(err);
				console.log(colors.FgMagenta, '[Google Api]: Token stored to', TOKEN_PATH);
			})
			callback(oAuth2Client);
		})
	})
}

// SEND EMAIL FROM SERVER
function makeBody(to, from, subject, message) {
	const args = { to: to, from: from, subject: subject, message: message };
	console.log(colors.FgMagenta, '[Google Api]: making body...' + JSON.stringify(args));
	var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
		"MIME-Version: 1.0\n",
		"Content-Transfer-Encoding: 7bit\n",
		"to: ", to, "\n",
		"from: ", from, "\n",
		"subject: ", subject, "\n\n",
		message
	].join('');

	var encodedMail = new Buffer.from(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
	return encodedMail;
}

function sendMessage(auth, to, subject, content) {
	const args = { auth: auth, to: to, subject: subject, content: content };
	console.log(colors.FgMagenta, '[Google Api]: sending message...' + JSON.stringify(args));
	const raw = makeBody(to, 'portal-filmowy@gmail.com', subject, content),
		gmail = google.gmail({ version: 'v1', auth });
	gmail.users.messages.send({
		auth: auth,
		userId: 'me',
		resource: {
			raw: raw
		}
	}, function (err, response) {
		console.log(colors.FgMagenta, '[Google Api]: response: ' + response);
		if (err) {
			console.log(colors.FgMagenta, '[Google Api]: error ' + err);
		}
		return (err || response)
	});
}

// *********************************************************   END OF GMAIL API *********************************************************

// GET CURRENT SERVER TIME
app.get('/api/servertime', (req, res, next) => {
	try {
		const time = (`${(new Date).getTime()}`);
		console.log(colors.FgGreen, '[Server]: get servertime called. Current time is: ' + time);
		res.send(time);
	}
	catch (err) {
		next(err);
	}
})

// UNIVERSAL GET FROM DB WITH QUERY AND SORTING + FILTERS
app.get('/api/dbquery/:dbname/:skip?/:limit?/:query?', collectionNotAllowed, async (req, res, next) => {
	try {
		serverLog(req, 'Universal GET')
		const dbname = req.params.dbname;
		const skip = parseInt(req.params.skip);
		const limit = parseInt(req.params.limit);
		const query = req.params.query;

		if (query !== "null" && query !== undefined) {
			let decodedQueryParams = decodeQueryParams(query);

			// CATEGORIES
			decodedQueryParams['categories'] ? (decodedQueryParams['categories']) = new RegExp((decodedQueryParams['categories']), 'i') : null;
			// NAME
			decodedQueryParams['name'] ? (decodedQueryParams['name']) = new RegExp((decodedQueryParams['name']), 'i') : null;
			// DURATION			
			if (decodedQueryParams['duration']) {
				let duration = decodedQueryParams['duration'].split(',');
				duration = { $gt: parseInt(duration[0]), $lt: parseInt(duration[1]) };
				decodedQueryParams['duration'] = duration;
			}
			// ORDER
			if (decodedQueryParams['order']) {
				var order = decodedQueryParams['order'];
				order = decodeOrderParams(order);
				delete decodedQueryParams['order'];
			} else {
				order = null;
			}

			const items = await db.collection(dbname).find(decodedQueryParams).skip(skip).limit(limit).sort(order).toArray();	//example: /api/dbquery/filmy/0/10/categories=cat1&order=name:1
			dbLog('Got results from DB!', 'find()', dbname, decodedQueryParams, items);
			res.send(items);
		} else {
			const items = await db.collection(dbname).find().skip(skip).limit(limit).sort().toArray();
			dbLog('Got results from DB!', 'find()', dbname, null, items);
			res.send(items);
		}
	}
	catch (err) {
		next(err);
	}
})

// RESULTS AMOUNT FOR PAGINATION
app.get('/api/pagesamount/:dbname/:query?', async (req, res, next) => {
	try {
		console.log(colors.FgGreen, '[Server]: GET pagesamount called.');
		const dbname = req.params.dbname;
		const query = req.params.query;
		if (query !== undefined) {
			let decodedQueryParams = decodeQueryParams(query);
			//NAME
			decodedQueryParams['name'] ? (decodedQueryParams['name']) = new RegExp((decodedQueryParams['name']), 'i') : null;
			//DURATION
			if (decodedQueryParams['duration']) {
				let duration = decodedQueryParams['duration'].split(',');
				duration = { $gt: parseInt(duration[0]), $lt: parseInt(duration[1]) };
				decodedQueryParams['duration'] = duration;
			}
			//CATEGORIES
			if (decodedQueryParams['categories']) { (decodedQueryParams['categories']) = new RegExp((decodedQueryParams['categories']), 'i') }
			db.collection(`${dbname}`).find(decodedQueryParams).count().then(amount => {
				res.send(`${amount}`);
				dbLog('Got results from DB!', 'find()', dbname, decodedQueryParams, amount);
			}).catch(err => console.error(`Failed to find documents: ${err}`))
		} else {
			const amount = await db.collection(`${dbname}`).count();
			res.send(`${amount}`);
			dbLog('Got results from DB!', 'find()', dbname, null, amount);
		}
	}
	catch (err) {
		next(err);
	}
})

// GET ONE FROM DB - id is string
app.get('/api/getOne/:dbName/:id?', collectionNotAllowed, async (req, res, next) => {
	try {
		console.log(colors.FgGreen, '[Server]: GET One called.\n Params: ' + req.params);
		if (req.params.dbName !== "messages" && req.params.dbName !== "users" && req.params.dbName !== "sessions" && req.params.dbName !== "confirmations") {
			if (req.params.id) {;
				const id = req.params.id
				const dbName = req.params.dbName;
				const result = await db.collection(dbName).findOne({ _id: id });
				
				res.send(result);
				dbLog('Got results from DB!', 'findOne()', dbName, null, result);
			}
		}
		else {
			console.log(colors.FgRed, 'User tried to get illegal data.');
			res.status(405).send("Not allowed to finish this action.");
		}
	}
	catch (err) {
		next(err);
	}
})

// GET ONE FROM DB - id is mongodb object
app.get('/api/getoneitem/:dbName/:id?', collectionNotAllowed, async (req, res, next) => {
	try {
		console.log(colors.FgGreen, '[Server]: getoneitem GET called.\n Params: ' + req.params);
		if (req.params.id) {
			const id = req.params.id;
			const dbName = req.params.dbName;
			const result = await db.collection(dbName).findOne({ _id: mongodb.ObjectId(id) });

			res.send(result);
			dbLog('Got results from DB!', 'findOne()', dbName, JSON.stringify({ _id: mongodb.ObjectId(id) }), result);
		}
	}
	catch (err) {
		next(err);
	}
})


// GET ONE FROM DB - FILTERS - id is string
app.get('/api/filters/:id?', async (req, res, next) => {
	try {
		console.log(colors.FgGreen, '[Server]: filters GET called.\n Params: ' + req.params);
		if (req.params.dbName !== "messages" && req.params.dbName !== "users" && req.params.dbName !== "sessions" && req.params.dbName !== "confirmations") {
			if (req.params.id) {
				const id = req.params.id;
				const dbName = "filters";
				const result = await db.collection(dbName).findOne({ _id: mongodb.ObjectId(id) });

				res.send(result);
				dbLog('Got results from DB!', 'findOne()', dbName, JSON.stringify({ _id: mongodb.ObjectId(id) }), result);
			}
		}
		else {
			res.status(405).send("Not allowed to finish this action.");
		}
	}
	catch (err) {
		next(err);
	}
})


// POST COMMENT
app.post('/api/comment/:dbName', isLoggedIn, async (req, res, next) => {
	try {
		console.log(colors.FgGreen, '[Server]: comment POST called.\n Params: ' + req.params);
		let body = req.body;
		body.user = req.user.username;
		body.timeCreated = Date.now();
		body.likes = 0;
		body.usersThatLiked = "";
		body.hasChild = false;

		if (body.parent_id !== "0") {
			await Comment.updateOne({ _id: body.parent_id }, { hasChild: true })
		}

		const newID = new mongodb.ObjectID;
		const insert = new Comment({ "_id": newID, ...body });

		await insert.save();

		//increase comments amount to + 1
		const _id = req.user._id;
		const currentCommentsAmount = await User.findById(_id, 'commentsamount').exec();

		dbLog('[Database]: user comments amount called!', 'findById', 'commentsamount', null, currentCommentsAmount)

		const newCommentsAmount = currentCommentsAmount.commentsamount + 1;

		User.findByIdAndUpdate(_id, { commentsamount: (newCommentsAmount) }, (err, docs) => {
			if (err) {
				next(err);
			}
			res.json(newID); // send newID to the front end
			dbLog('Increase comments amount to +1.', 'findByIdAndUpdate()', 'users', 'by id', docs);
		})
	}
	catch (err) {
		next(err);
	}
})

// POST USER
app.post('/api/newUser/users', async (req, res, next) => {
	try {
		const body = req.body;
		const loginExists = await User.exists({ username: body.username });
		const emailExists = await User.exists({ email: body.email });
		if (loginExists) {
			res.send('User login is already in use!');
			return;
		}
		if (emailExists) {
			res.send('User email is already in use!');
			return;
		}
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(body.password, salt);
		const buffer = await require('crypto').randomBytes(48);
		const token = buffer.toString('hex');
		const newUser = new User({
				username: body.username,
				password: hash,
				email: body.email,
				dateofbirth: body.dateofbirth,
				from: body.from,
				commentsamount: 0,
				ratingsamount: 0,
				//avatar: body.avatar,
				about: body.about,
				authorized: false,
				token: token
			});
		
		await newUser.save();

		const emailContent = `Potwierdź rejestrację konta przez następujący link: https://portal-filmowy-jw-01.herokuapp.com/user-confirmation/${body.username}/${token}`;

		sendEmail(body.email, `Portal Filmowy - ${body.username} - potwierdzenie rejestracji`, emailContent);
		res.status(200);
		res.send('User registered');
	}
	catch (err) {
		res.status(500);
		res.send('Server error. Could not register user.');
		next(err);
	}
})


// EDIT USER
app.post('/api/edituser/', isLoggedIn, async (req, res, next) => {
	try {
		const body = req.body;
		const user_id = req.user._id;
		const docs = await User.findByIdAndUpdate(user_id, { about: body.about, from: body.from });

		dbLog('Edit user', 'findByIdAndUpdate', 'users', 'by id', docs);
		res.status(200).send('User edited.');
	}
	catch (err) {
		res.status(400).send('Bad Request');
		next(err);
	}
})

// CHANGE PASSWORD
app.put('/api/editpassword', isLoggedIn, async (req, res, next) => {
	try {
		const newPass = req.body.newPass;
		const oldPassTypedByUser = req.body.oldPass;
		let oldPass = await User.findOne({ username: req.user.username }, "password");

		dbLog('Getting old users password.', 'findOne()', 'users', JSON.stringify({ username: req.user.username }), oldPass);

		oldPass = oldPass.password;
		const compare = await bcrypt.compare(oldPassTypedByUser, oldPass);

		if (oldPassTypedByUser === newPass) {
			res.send("Passwords are the same!");
		} else {
			if (compare) {
				const salt = await bcrypt.genSalt(10);
				const hash = await bcrypt.hash(newPass, salt);
				const docs = await User.findOneAndUpdate({ username: req.user.username }, { password: hash });
				res.status(200);
				res.send('New password set.');
				dbLog('New user password updated.', 'findOneAndUpdate()', 'users', JSON.stringify({ username: req.user.username }), docs);
			}
		}
	}
	catch (err) {
		res.status(500);
		res.send('Something went wrong.');
		next(err);
	}
})


// CONFIRM USER REGISTRATION
app.get('/api/userconfirmation/:username/:token', async (req, res, next) => {
	try {
		const docs = await User.findOneAndUpdate({ username: req.params.username, token: req.params.token }, { authorized: true });

		res.send(`User ${docs.username} authorized.`);
		dbLog('Confirm user registration.',
			'findOneAndUpdate()', 'users',
			JSON.stringify({ username: req.params.username, token: req.params.token }),
			docs);
	}
	catch (err) {
		next(err);
		res.status(500);
		res.send('Something went wrong.');
	}
})

// RATING
app.post('/api/rate/:dbName/:id/:rating', isLoggedIn, async (req, res, next) => {
	try {
		// CHECK IF USER RANKED POSITION
		const rating = await Rating.findOne({ "username": req.user.username, "ratedPositionID": req.params.id }, 'dbName ratedPositionID');
		// USER RANKED BEFORE - UPDATE RANKING
		if (rating) {
			console.log('User ranked before. Updating...');

			const doc = await Rating.findOneAndUpdate(
				{ "username": req.user.username, "ratedPositionID": req.params.id },
				{ "rating": req.params.rating }
			);

			dbLog('User ranked before. New ranking.', 'findandUpdate()', 'users', JSON.stringify({ "username": req.user.username, "ratedPositionID": req.params.id }), doc);
			refreshRankValue(req.params.dbName, req.params.id, res);
		}
		//USER HAVEN'T RANKED YET - NEW RANKING
		else {
			console.log('User ranked for the first time');

			const body = {
				"username": req.user.username,
				"ratedPositionID": req.params.id,
				"dbName": req.params.dbName,
				"timeCreated": Date.now(),
				"rating": req.params.rating
			};
			const insert = new Rating(body)

			await insert.save();
			refreshRankValue(req.params.dbName, req.params.id, res);

			const docs = User.findOneAndUpdate({ username: req.user.username }, { $inc: { ratingsamount: 1 } });

			dbLog('User havent ranked yet. New ranking.', 'findandUpdate()', 'users', JSON.stringify({ '$inc': { ratingsamount: 1 } }), docs);
		}
	}
	catch (err) {
		next(err);
	}
})


// DELETE COMMENT - prepared for more DBs if split in future
app.delete('/api/deleteComment/:dbName/:id', isLoggedIn, async (req, res, next) => {
	try {
		const alertText = 'You are not allowed to complete this action.'
		const dbName = req.params.dbName;
		const id = req.params.id;
		const selector = { _id: mongodb.ObjectId(id) };
		const selector2 = { parent_id: mongodb.ObjectId(id) };
		const comment = await db.collection(dbName).findOne(selector);

		dbLog('Removing comment...', 'findOne()', dbName, JSON.stringify(selector));

		if (comment.user === req.user.username) {
			// remove comment and all responds to that comment
			if (comment.parent_id === 0) {
				await db.collection(dbName).deleteMany(selector2);
				dbLog(`CHILD comments of ${selector._id} - succesfully removed!`, 'deleteMany()', JSON.stringify(selector2));
				await db.collection(dbName).deleteOne(selector);
				dbLog('MAIN TREE comment - succesfully removed!', 'deleteOne()', JSON.stringify(selector));
			}
			// remove single comment
			else {
				await db.collection(dbName).deleteOne(selector);

				let parentId = comment.parent_id;
				let otherResps = await Comment.find({ parent_id: parentId });

				if (otherResps.length === 0) {
					await Comment.updateOne({ _id: comment.parent_id }, { hasChild: false });
				}

				dbLog('SINGLE comment - succesfully removed.', 'deleteOne()', JSON.stringify(selector2));
			}
			//decrease comments amount to - 1
			const _id = req.user._id;
			const currentCommentsAmount = await User.findById(req.user._id, 'commentsamount').exec();
			const newCommentsAmount = currentCommentsAmount.commentsamount - 1;
			const docs = await User.findByIdAndUpdate(_id, { commentsamount: (newCommentsAmount) });

			dbLog('Decrease comments amount to -1.', 'findById()', 'commentsamount', 'by id', docs);
			res.send("Comment removed succesfully!");
		}
		else {
			console.log(colors.FgRed, 'User tried to remove not his comment!');
			res.send(alertText);
		}
	}
	catch (err) {
		next(err);
	}
})

// COMMENT LIKES - LIST OF USERS THAT LIKED PARTICULAR COMMENT
app.get('/api/comment_likes/:comment_id', async (req, res, next) => {
	try {
		serverLog(`Comment ${req.params.comment_id} likes list called.`);

		const data = await Comment.findById(req.params.comment_id, 'usersThatLiked');

		dbLog('GET comment_likes called.', 'find()', 'users', data);

		const users = await data.usersThatLiked;

		res.send(users)
	}
	catch (err) {
		next(err);
	}
})


// COMMENT LIKES - ADD USER TO LIST OF USERS THAT LIKED PARTICULAR COMMENT
app.post('/api/comment_likes/post/:comment_id', isLoggedIn, async (req, res, next) => {
	try {
		serverLog(`Comment ${req.params.comment_id}, like called by ${req.user}.`);
		const username = req.user.username;
		const comment_id = req.params.comment_id;

		const updateComment = async (users) => {
			const likesAmount = users.length;
			const resComments = await Comment.findByIdAndUpdate(comment_id, { likes: likesAmount });

			if (resComments) {
				dbLog('Got results!', 'findByIdAndUpdate', 'comments', { comment_id: comment_id }, resComments);
			}
			else {
				dbLog('No results!', 'findByIdAndUpdate', 'comments', { comment_id: comment_id }, resComments);
			}
		}

		let data = await Comment.findById(comment_id, 'usersThatLiked likes');

		dbLog('Got results!', 'findOne', 'comments', { comment_id: comment_id }, data);

		users = data.usersThatLiked;
		users = users.split(', ');

		if (users.includes(username)) {
			users = users.filter(el => el !== '');
			users = users.filter(el => el !== username);
			likesAmount = users.length;

			updateComment(users, users.length);

			users = users.join(', ');
			let resp = {};

			if (users.length !== 0) {
				resp = await Comment.findByIdAndUpdate(comment_id, { usersThatLiked: users, likes: likesAmount });
			}
			else {
				resp = await Comment.findByIdAndUpdate(comment_id, { usersThatLiked: '', likes: likesAmount });
			}
			dbLog('Got results!', 'updateOne', 'comments', { comment_id: comment_id }, resp);
			res.send({ newLiker: username, newLikesAmount: likesAmount });
		}

		else {
			users.push(username);

			users = users.filter(el => el !== '');
			likesAmount = users.length;

			updateComment(users);

			users = users.join(', ');
			let resp = {};

			if (users.length !== 0) {
				resp = await Comment.findByIdAndUpdate(comment_id, { usersThatLiked: users, likes: likesAmount });
			}
			else {
				resp = await Comment.findByIdAndUpdate(comment_id, { usersThatLiked: '', likes: likesAmount });
			}

			dbLog('Got results!', 'updateOne', 'comments_likes', { comment_id: comment_id }, resp);
			res.send({ removeLiker: username, newLikesAmount: likesAmount });
		}
	}
	catch (err) {
		next(err)
	}
})

// CHECK IF COMMENT HAS BEEN LIKED BY USER
app.get('/api/checkifuserlikedcomment/:comment_id', isLoggedIn, async (req, res, next) => {
	try {
		const username = req.user.username;
		const comment_id = req.params.comment_id;
		const data = await Comment.find({ _id: comment_id, usersThatLiked: { $regex: username } });

		dbLog('GET comment likes data.', 'find()', 'comments', `comment_id: ${comment_id}`, data);

		if (data && data.length !== 0) {
			res.send(true);
		}
		else {
			res.send(false);
		}
	}
	catch (err) {
		next(err);
	}
})


// APPROXIMATE SEARCH
app.get('/api/search/string=:string', async (req, res, next) => {
	try {
		let string = req.params.string;
		// BLOCK SEARCHING MORE THAN 30 SYMBOLS
		if (string.length <= 30) {
			let words = string.split(' ');
			// BLOCK SEARCHING LESS THAN 3 SYMBOLS
			if (string === "null" || string.length < 3) {
				res.send('Type at least 3 characters!');
			}
			else {
				// MORE THAN ONE WORD TYPED
				if (words.length >= 2) {
					var allResults = [];
					words.forEach(async (el, index) => {
						const docs = await SearchItem.find({ name: new RegExp(el, 'i') }).skip().sort({ name: '-1' }).limit(5);
						if (allResults.length === 0) {
							allResults = docs;
						}
						else {
							allResults = allResults.concat(docs);
						}
						if (index === words.length - 1) {
							allResults = allResults.filter(by('name'), new Set);
							res.send(allResults);
						}
					})
				}
				else {
					//ONE WORD TYPED
					const searchItem = await SearchItem.find({ name: new RegExp(string, 'i') }).skip().sort({ name: '-1' }).limit(5);
					res.send(searchItem);
				}
			}
		}
		else {
			res.send('Search string too long!');
		}
	}
	catch (err) {
		next(err);
	}
})


// GET BASIC USER DATA - ID, USERNAME AND THUMBNAIL FOR COMMENTS ETC.
app.get('/api/user/:username', async (req, res, next) => {
	try {
		const userData = await User.find({ username: req.params.username }).select('username avatar');

		res.send(userData);
		dbLog('GET basic user data.', 'find() + select()', 'users', userData);
	}
	catch (err) {
		next(err);
	}
})

// GET ALL USER DETAILS - FULL INFORMATION OF USER PROFILE
app.get('/api/userDetails/:username', async (req, res, next) => {
	try {
		const userData = await User.find({ username: req.params.username }).select('username dateofbirth from commentsamount ratingsamount avatar about');
		dbLog('GET user details.', 'find() + select()', 'users', userData);
		
		if(userData.length > 0) {
			res.send(userData);
		}
		else {
			res.sendStatus(404);
		}
	}
	catch (err) {
		next(err);
	}
})

// CHECK IF USERNAME EXISTS
app.get('/api/checkuserexistence/:username', async (req, res, next) => {
	try {
		const user = await User.find({ username: req.params.username });

		if (user.length === 1) {
			res.send(true);		//user exists
			dbLog('Check user existence.', 'find()', 'users', true);
		}
		else if (user.length === 0) {
			res.send(false);		// user doesn't exist
			dbLog('Check user existence.', 'find()', 'users', false);
		}
		else {
			res.send('Something gone wrong!');
		}
	}
	catch (err) {
		next(err);
	}
})

// CHECK IF EMAIL EXISTS
app.get('/api/checkemailexistence/:email', async (req, res, next) => {
	try {
		let email = await User.find({ email: req.params.email });

		if (email.length === 1) {
			res.send(true);		//email exists
			dbLog('Check email existence.', 'find()', 'users', true);
		}
		else if (email.length === 0) {
			res.send(false);		// email doesn't exist
			dbLog('Check email existence.', 'find()', 'users', false);
		}
		else {
			res.send('Something gone wrong!');
		}
	}
	catch (error) {
		next(error);
	}
})


// UPLOAD AVATAR
app.post(`/api/uploadavatar/:login`, isLoggedIn, async (req, res, next) => {
	console.log(`req.user._id: ${req.user._id}`);

	if (req.user.username === req.params.login) {
		try {
			//SAVE FILE
			var storage = multer.diskStorage({
				destination: function (req, file, cb) {
					cb(null, './public/img/avatars')
				},
				filename: function (req, file, cb) {
					cb(null, Date.now() + '-' + file.originalname)	// name is always unique
				}
			});
			// FIND OLD FILE NAME
			const user = await User.findOne({ username: req.user.username }, "avatar");
			if(user.avatar) {
			// REMOVE OLD AVATAR FILE
			dbLog('Find old avatar file name', 'findOne', 'users', JSON.stringify({ username: req.user.username }), user);
			let oldFilePath = (__dirname.replace(/\\/g, "/") + "/public" + user.avatar);
			fs.unlink(oldFilePath);
			}

			//UPLOAD NEW AVATAR FILE
			var uploadAvatar = multer({ storage: storage }).single('file')
			uploadAvatar(req, res, async function (err) {
				if (err instanceof multer.MulterError) {
					return res.status(500).json(err);
				} else if (err) {
					return res.status(500).json(err);
					next(err)
				}
				//SAVE IN DB
				const selector = { _id: req.user._id };
				const avatarPath = { avatar: `/img/avatars/${req.file.filename}` };
				const updateAvatar = await User.updateOne(selector, avatarPath);
				dbLog('Updating avatar in DB.', 'updateOne()', 'users', JSON.stringify(selector, JSON.stringify(updateAvatar)), updateAvatar);
				return res.send({ newAvatarPath: `/img/avatars/${req.file.filename}`});
			})
		}
		catch (err) {
			next(err);
		}
	}
	else {
		res.status(400).send(`No login or wrong login!`);
	}
})


// ******************************************************************  MESSAGES ***************************************************************** 
// VIEW MESSAGES BETWEEN TWO USERS - WITH PAGINATION
app.get('/api/getmessages/:sender/:receiver/:skip/:limit', isLoggedIn, async (req, res, next) => {
	if ((req.user.username === req.params.sender) || (req.user.username === req.params.receiver)) {
		try {
			const messages = await Message.find(
				{
					sender: { $in: [req.params.sender, req.params.receiver] },
					receiver: { $in: [req.params.receiver, req.params.sender] }
				},
				null,
				{
					skip: parseInt(req.params.skip),
					limit: parseInt(req.params.limit)
				}
			).sort({ time_sent: -1 }).exec()
			res.send(messages);
		}
		catch (err) {
			next(err);
			res.status(500).send('Something gone wrong.');
		}
	}
})

// MESSAGES PREVIEW
app.get('/api/messagespreview/:skip/:limit', isLoggedIn, async (req, res, next) => {
	try {
		let skip = parseInt(req.params.skip);
		let limit = parseInt(req.params.limit);
		// FIRST PART - RECEIVED MESSAGES
		const receivedMessages = await Message.aggregate(
			[
				{
					"$match":
						{ "receiver": req.user.username }
				},
				{
					"$sort": {
						"time_sent": -1,		// sort descending
					}
				},
				{
					"$group": {
						"_id": "$sender",
						"content": {
							"$first": "$content"
						},
						"time_sent": {
							"$first": "$time_sent"
						},
						"sender": {
							"$first": "$sender"
						},
						"receiver": {
							"$first": "$receiver"
						},
						"time_received": {
							"$first": "$time_received"
						},
						"status": {
							"$first": "$status"
						}
					}
				},
				{
					"$project": {
						"_id": 0,
						"sender": "$_id",
						"receiver": 1,
						"content": 1,
						"time_sent": 1,
						"time_received": 1,
						"status": 1
					}
				},
				{ "$skip": skip },
				{ "$limit": limit }
			]
		)
		// SECOND PART - MESSAGES SENT BY USER
		let sendMessages = await Message.aggregate(
			[
				{
					"$match":
						{ "sender": req.user.username }
				},
				{
					"$sort": {
						"time_sent": -1,		// sort descending
					}
				},
				{
					"$group": {
						"_id": "$receiver",
						"content": {
							"$first": "$content"
						},
						"time_sent": {
							"$first": "$time_sent"
						},
						"sender": {
							"$first": "$sender"
						},
						"receiver": {
							"$first": "$receiver"
						},
						"time_received": {
							"$first": "$time_received"
						},
						"status": {
							"$first": "$status"
						}
					}
				},
				{
					"$project": {
						"_id": 0,
						"sender": 1,
						"receiver": "$_id",
						"content": 1,
						"time_sent": 1,
						"time_received": 1,
						"status": 1
					}
				},
				{ "$skip": skip },
				{ "$limit": limit }
			]
		)
		const allMessages = sendMessages.concat(receivedMessages);
		let latestMessages = [];

		allMessages.forEach((message) => {
			// Unread message
			if (message.time_received === null && !latestMessages.includes(message)) {
				latestMessages.push(message);
			}
			allMessages.forEach((msg) => {
				// More than one message in conversation. Choose more recent message.
				if (message.sender === msg.receiver && message.receiver === msg.sender && message.time_sent > msg.time_sent && !latestMessages.includes(message)) {
					latestMessages.push(message);
				}
			})
		})

		// Rest of messages
		let latestMessagesKeys = []
		latestMessages.forEach(el => {
			latestMessagesKeys.push(el.sender);
			latestMessagesKeys.push(el.receiver);
		})

		Array.prototype.getUnique = function () {
			var uniques = [];
			for (var i = 0, l = this.length; i < l; ++i) {
				if (this.lastIndexOf(this[i]) === this.indexOf(this[i])) {
					uniques.push(this[i]);
				}
			}
			return uniques;
		}

		let unique = latestMessagesKeys.getUnique()
		allMessages.forEach(message => {
			if (!unique.includes(message.receiver) && !unique.includes(message.sender)) {
				latestMessages.push(message);
			}
		})
		latestMessages.sort(function (a, b) { return b["time_sent"] - a["time_sent"] });
		latestMessages = latestMessages.splice(0, limit);
		res.send(latestMessages);
	}
	catch (err) {
		next(err);
	}
})
// END OF MESSAGES PREVIEW


// UNREAD MESSAGES AMOUNT
app.get('/api/get-unread-messages/:username', async (req, res) => {
	try {
		const unreadMessagesAmount = await Message.aggregate(
			[
				// Matching pipeline, similar to find
				{
					"$match":
						{ "receiver": req.params.username, "status": "missed" }
				},
				// Sorting pipeline
				{
					"$sort": {
						"time_sent": -1,		// sort descending
					}
				},
				// Grouping pipeline
				{
					"$group": {
						"_id": "$sender",
						"content": {
							"$first": "$content"
						},
						"time_sent": {
							"$first": "$time_sent"
						},
						"sender": {
							"$first": "$sender"
						},
						"receiver": {
							"$first": "$receiver"
						},
						"time_received": {
							"$first": "$time_received"
						},
						"status": {
							"$first": "read"
						}
					}
				},
				// Project pipeline, similar to select
				{
					"$project": {
						"_id": 0,
						"sender": "$_id",
						"receiver": 1,
						"content": 1,
						"time_sent": 1,
						"time_received": 1,
						"status": 1
					}
				},
				{ "$count": "myCount" }
			]

		)
		if (unreadMessagesAmount[0]) {
			res.send(unreadMessagesAmount[0].myCount.toString());
		}
		else {
			res.send("0")
		}
	}
	catch (err) {
		if (err) {
			console.log(err);
			res.status(500);
			res.send('Something gone wrong');
		}
	}
}
)
// END OF UNREAD MESSAGES AMOUNT


// COUNT MISSED MESSAGES
app.get('/api/countmissedmessages', async (req, res) => {
	if (req.user) {
		const username = req.user.username;

		try {
			const messages = await Message.find({ receiver: username, status: "missed" }, "status");
			messagesAmount = messages.length;

			res.send(messagesAmount.toString());
			console.log(messagesAmount);
		}
		catch (err) {
			res.send(err);
		}
	}
	else {
		res.status(400).send('You are not logged in!');
	}
})


// CHANGE MESSAGE STATUS TO READ && SET time_received
app.post('/api/readmessage/:message_id', async (req, res) => {
	if (req.user) {
		if (req.user.username === req.params.message_id) {
			try {
				const res = await Message.updateOne({ _id: req.params.message_id, time_received: (new Date).getTime(), status: "read" });
				res.send(res);
				dbLog('Change message status to read and set time_receiver', 'updateOne()', 'messages', { _id: req.params.message_id, time_received: (new Date).getTime(), status: "read" }, res);
			}
			catch (err) {
				console.log(err);
				res.send(err);
			}
		}
	}
	else {
		res.send(`You are not logged in! Can't finish this action!`);
	}
})

// ************************************************************** END OF MESSAGES *****************************************************

// SET MESSAGES STATUS IN DB
app.post('/api/set-messages-status/:receiver/:sender', (req, res) => {
	serverLog(req, 'Set messages status')
	try {
		const sender = req.params.sender;
		const receiver = req.params.receiver;
		if (req.user.username = receiver) {
			const upd = Message.updateMany({
				receiver: receiver, sender: sender, time_received: null
			}, {
				time_received: (new Date()).getTime(),
				status: "read"
			}
			).exec(err => {
				if (err) {
					res.status(500);
					res.send("Something gone wrong");
				}
				res.status(200);
				res.send('Updated');
				dbLog('Setting messages status.', 'updateMany', 'messages', JSON.stringify({ receiver: receiver, sender: sender, time_received: null }), upd);
			})
		}
	}
	catch (err) {
		if (err) {
			res.status(500);
			res.send('Something gone wrong');
		}
	}
})

// GET NEWS FOR MAIN PAGE
app.get('/api/news_Preview', (req, res, next) => {
	try {
		News.find({}, "title thumbnail header paragraph", (err, docs) => {
			if (err) {
				res.status(500);
			}
			res.send(docs);
		}).limit(20)
	}
	catch (err) {
		next(err);
	}
})

// GET USER AVATAR PATH
app.get('/api/user-avatar/:name', async (req, res, next) => {
	try {
		const defaultPath = '/img/avatars/defaultAvatar.jpg';
		const name = req.params.name;
		const path = await User.findOne({ username: name }, 'avatar');
		dbLog('Getting user Avatar path');
		if (path) {
			pathAvatar = path.avatar;
			pathAvatar && pathAvatar.length > 0 ? res.send(pathAvatar) : res.send(defaultPath);
		}
		else {
			res.send(defaultPath);
		}
	}
	catch (error) {
		next(error);
	}
})

// ADDITIONAL FUNCTIONS
// DECODE QUERY PARAMS
// Example:
// /api/dbquery/filmy/0/5/categories=cat1&duration=%7B%20%22%24gt%22%3A%20%2260%22%2C%20%22%24lt%22%3A%20%2290%22%20%7D

function decodeQueryParams(queryParams) {
	queryParams = JSON.parse('{"' + decodeURI(queryParams).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
	queryParams = Object.entries(queryParams);

	queryParams.map(param => {
		if (param[1].includes('{')) {		//if param value includes {} chars, convert it to JSON
			param[1] = JSON.parse(param[1]);
		}
	})

	queryParams = Object.fromEntries(queryParams);

	return queryParams;
}

// DECODE ORDER PARAMS
function decodeOrderParams(param) {
	param = `{${param}}`;
	param = param.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
	param = JSON.parse(param);

	return param;
}


// REMOVE DUPLICATES FROM JSON ARRAY
const by = property => function (object) {
	const value = object[property];
	return !(this.has(value) || !this.add(value));
}


// COUNT NEW VALUE AND UPDATE RANK
async function refreshRankValue(dbName, ratedPositionID, res) {
	//CALCULATE NEW RANKING
	console.log('Calculating new ranking value...');

	let ratings = await Rating.find({ ratedPositionID: ratedPositionID }).select('rating');
	let ratingsAmount = 0;
	let ratingsSum = 0;

	ratings.forEach(el => {
		ratingsAmount++;
		ratingsSum += parseFloat(el.rating)
	})

	ratingsAmount = parseInt(ratingsAmount);
	let averageRank = ratingsSum / ratingsAmount;
	// SET NEW RANKING IN PROPER COLLECTION
	const mapping = [[Film, 'filmy'], [Series, 'seriale'], [Premiere, 'premiers'], [Actor, 'aktorzy']]; //key value pairs for proper dbname

	mapping.forEach(el => {
		if (dbName === el[1])
			el[0].findByIdAndUpdate(ratedPositionID, { rating: averageRank, ratingsAmount: ratingsAmount }, (err, docs) => {
				if (err) {
					console.log(err);
				}
			})
	})
	res.send({ averageRank: averageRank.toString(), ratingsAmount: ratingsAmount })
}

// SOCKET IO - MESSENGER
try {
	io.on('connection', (socket) => {
		if (socket.request.session.passport && socket.request.session.passport.user) {
			let room = socket.request.session.passport.user;

			console.log(colors.FgMagenta, `[Socket IO]: Recognized user connected. socket.id: ${socket.id}, room: ${room}`);
			socket.join(room);

			// READ MESSAGES IF USER JOINED CONVERSATION
			socket.on('read messages', async (receiverID) => {
				let room1 = `${room}+${receiverID}`;
				let room2 = `${receiverID}+${room}`;
				socket.join(room1);
				socket.join(room2);
				socket.join(receiverID);

				console.log(colors.FgMagenta, `[Socket IO]: ${socket.request.session.passport.user} just read messages from: ${receiverID}`); 	// receiver from logged in user perspective
				io.to(room1).to(room2).to(receiverID).emit('read messages', receiverID);
			})

			// CHAT MESSAGE
			socket.on('chat message', async (msg) => {
				console.log('[JW] chat message!');
				// todo: change getting userName and ReceiverName from DB to more efficient way
				let userName = await User.find({ _id: room }, 'username').exec();
				userName = userName[0].username;
				let receiverName = await User.find({ _id: msg.receiver }, 'username').exec();
				receiverName = receiverName[0].username;

				let room1 = `${room}+${msg.receiver}`
				let room2 = `${msg.receiver}+${room}`

				socket.join(room1);
				socket.join(room2);
				socket.join(msg.receiver);

				// if users are present during message sending, message status will be set to "read" immediately, else to "missed"
				if (Array.from(io.sockets.adapter.rooms.get(room2)).length + Array.from(io.sockets.adapter.rooms.get(room1)).length >= 4) {
					msg.status = "read";
					msg.time_received = new Date().getTime();
				}
				else {
					console.log('ONLY ONE USER PRESENT');

					msg.status = "missed";
					msg.time_received = null;
				}

				if (msg.content.length > 0) {
					try {
						Message.collection.insertOne(
							{
								sender: userName,	// change
								receiver: receiverName,	// change
								time_sent: (new Date).getTime(),
								time_received: msg.time_received,
								content: msg.content,
								status: msg.status
							}
						)
					}
					catch (err) { console.log(err) }
				}
				else {
					console.log('Empty message!');
				}
				io.to(room1).to(room2).to(msg.receiver).emit('chat message', { userName: userName, msg: msg });
				console.log(colors.FgMagenta, `Message: ${msg} sent to rooms: ${room1}, ${room2}, ${msg.receiver}`);
			})

			//DISCONNECT
			socket.on('disconnect', () => {
				console.log(colors.FgMagenta, '[Socket IO]: user: ' + room + ' disconnected');
			})
		}
		else {
			console.log(colors.FgMagenta, '[Socket IO]: anonymous user connected!');
		}
	})
}
catch (err) {
	console.log(err);
}
//END OF SOCKET IO




// ************************************************************* COLORFUL LOGS *****************************************************************
// DB
function dbLog(communicate, method, dbName, query, results) {
	try {
		query === null ? query = 'none' : query = JSON.stringify(query);
		console.log(colors.FgYellow, `[Database]: ${communicate} Method: ${method} called, dbName: ${dbName}, query: ${query}, results_type: ${typeof (results)}`);
	}
	catch (err) {
		if (err) { console.log(colors.FgRed), err };
	}
}

// SERVER
function serverLog(req, method) {
	try {
		console.log(colors.FgGreen, `[Server]: ${method} ${req.path} | Called by: ${req.user ? req.user.username : 'anonymous'}`);
	}
	catch (err) {
		if (err) { console.log(colors.FgRed, '[Server]: Server error! Method: ' + 'Path:' + req.path + ' called by ' + req.user === undefined ? req.user.username : 'anonymous') ;}
	}
}
// END OF ALL GUWNO TEST

// REACT REROUTING
if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(path.join(__dirname, 'client/build')));

	// Handle React routing, return all requests to React app
	app.get('*', function (req, res) {
		res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
	});
}

// ************************************************* START SERVER + DATABASE CONNECTIONS ***********************************************
// Start Mongoose 
mongodb.MongoClient.connect(connectionString, connectionOptions, function (err, database) {
	if (err) {
		console.log(colors.FgRed, '[Database]: Mongo Client connection error!' + error);
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
		console.log(colors.FgCyan, '\n*\n*\n*\n*\n*\n*\n');
		console.log(colors.FgYellow, '[Database]: database connected! Mongo Client and Mongoose are ready.');
		console.log(colors.FgBlue, `[Server]: server started. Listening on port *:${port}`);
	}).on('error', (err) => {
		console.log(colors.FgRed, '[Server]: Server listen error!');
		console.log(err);
	})
});

// Update many items basing on one properly filled item

// async function updateItems() {
// 	const referenceFilm = await Film.findOne({_id: '60a391cbe2ed0736243405cf'});
// 	const referencePhotos = referenceFilm.photos;
// 	Actor.updateMany({}, {photos: referencePhotos}, (err, docs) => {
// 		if(err) {
// 			console.log(err)
// 		}
// 		console.log('docs updated')
// 		console.log(docs);
// 	})
// }
// updateItems();