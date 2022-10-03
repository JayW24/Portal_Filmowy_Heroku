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

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

server.listen(port, () => console.log(`Listening on port ${port}`));