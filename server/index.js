'use strict'

const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const db = require('./db');
//const session = require('express-session');

module.exports = app;

// server logging
app.use(morgan('dev'));
// req.body parsing
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
// static files
app.use(express.static(path.join(__dirname, '../public')));

//api routes
app.use('/api', require('./api'));

// status html
app.get('*', (req, res, next) => {
	res.sendFile(path.join(__dirname, '../public/index.html'))
});

// sync database
db.sync({force: false})
	.then(() => {
		// start server
		app.listen(8080, () => {
			console.log('server is listening on 8080')
		})
	});

// app.use(session({
// 	secret: process.env.SESSION_SECRET || 'default secret',
// 	resave: false,
// 	saveUninitialized: false
// }));

app.use((err, req, res, next) => {
	console.error(err);
	console.error(err.stack);
	res.status(err.status || 500).send(err.message || 'Internal server error.')
});
