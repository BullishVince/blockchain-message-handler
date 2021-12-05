var express = require('express')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

let app = express()

//Basic conf
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//init routes
var messageRoute = require('./routes/message')

//set routes
app.use('/message', messageRoute);

app.listen(3000 || process.env.PORT, () => {
  console.log("Server listening on port 3000")
})