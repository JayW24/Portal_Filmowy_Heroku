const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const colors = require('./colorfulLogs').colors;
const app = express();
const port = process.env.PORT || 5000;
const http = require('http');
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

server.listen(port, () => {
	console.log(colors.FgCyan, '\n*\n*\n*\n*\n*\n*\n')
	console.log(colors.FgYellow, '[Database]: database connected! Mongo Client and Mongoose are ready.')
	console.log(colors.FgBlue, `[Server]: server started. Listening on port *:${port}`)
}).on('error', (err) => {
	console.log(colors.FgRed, '[Server]: Server listen error!')
	console.log(err)
})