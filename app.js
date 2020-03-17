var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var http = require('http');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
const port = 3001
var app = express();
require('./routes.js')(app);

var uri = 'mongodb://127.0.0.1:27017/spot';
mongoose.connection.openUri(uri ,{ useUnifiedTopology: true, useNewUrlParser: true }, function (err, res) {
    if (err) {
        console.log('Error connecting to: ' + uri + '. ' + err);
    } else {
        console.log('Connected to: ' + uri);
    }
});


var httpServer = http.createServer(app).listen(port, function () {
  console.log('Node app is listening on port.. ' + port);
});

io = require('socket.io')(httpServer);


io.on("connection", function (socket) {
  console.log('a user connected');




  socket.on("socketFromClient", function (data) {

    var update = {}
    update.loc = { type: "Point", coordinates: [data.longitude, data.latitude] }

    User.findOneAndUpdate(query, { $set: update }, { new: true }, function (err, data) {
      if (err) {
        return socket.emit('responseFromServer', err);
      } else if (data) {
        io.emit('responseFromServer', data);
      }
    })

  });

  socket.on('disconnect', function (socket) {

      console.log('a user disconnected');
  })
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
