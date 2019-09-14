const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');

const app = express();

const port = 3000;

// Passport config
require ('./config/passport')(passport);

//Mongoose
const db = require('./config/keys').MongoURI;
mongoose.Promise = global.Promise;
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log('\nMongodb connected...'))
    .catch(err => console.error(err));

//Express static
app.use(express.static(__dirname + '/views'));


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//Express Session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Router
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));

app.listen(port, () => {
    console.log('Server is running on port 3000');
});