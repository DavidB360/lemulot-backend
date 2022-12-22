// environement variables 
require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// routes loading
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tutorialsRouter = require('./routes/tutorials');
var helprequestsRouter = require('./routes/helprequests');

var app = express();
// pour upload photos vers cloudinary
const fileUpload = require('express-fileupload');
app.use(fileUpload());
//
const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes url assignment
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tutorials', tutorialsRouter);
app.use('/helprequests', helprequestsRouter)

module.exports = app;
