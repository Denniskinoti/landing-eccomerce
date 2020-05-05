var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
//var flash = require('connect-flash')
var flash = require('connect-flash-plus');
const mongoose = require('mongoose')
const Validator = require('express-validator')
const methodOverride = require('method-override')
const fileUpload = require('express-fileupload')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin') 
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/products')
const pageRouter = require('./routes/pages')
var produucts = require('./routes/produucts')
const cart = require('./routes/cart');

var app = express();

mongoose.connect('mongodb://localhost:27017/ejsExpress', {useNewUrlParser: true});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//express fileupload
app.use(fileUpload({
  createParentPath: true
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
  secret: 'thisisnow',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(flash());

app.get('*',(req,res,next)=> {
  res.locals.cart = req.session.cart
  console.log('the cart is req session:',req.session.cart) 
  next();
})

app.use(express.static(path.join(__dirname, 'public')));

//pages getting
var Page = require('./model/pages');
Page.find().sort({sorting: 1}).exec((err,results)=> {
  if(err) {
    throw err
  }else {
    app.locals.pages = results;
  }
})

//categories
var Category = require('./model/category');

Category.find().then((category)=> {
  if(category) {
    app.locals.category = category
  }
}).catch((error)=> {
  throw error
})

app.use((req,res,next)=> {
  res.locals.currentUser = req.user;
  res.locals.info = req.flash('info')
  res.locals.error =  req.flash('error');
  res.locals.messages = req.flash('messages')
  next();
});

app.use(Validator({
  customValidators: {
    isImage: function(value,filename) {
      var extension = (path.extname(filename)).toLowerCase();
      switch(extension) {
        case '.jpg':return '.jpg';
        case '.jpeg':return '.jpeg';
        case '.png':return '.png';
        case '':return '.jpg';
        default: return false;
      }
    }
  }
}))


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin',adminRouter)
app.use('/category',categoryRouter)
app.use('/products',productRouter)
app.use('/page',pageRouter);
app.use('/produucts',produucts);
app.use('/cart' ,cart)



app.listen(3000,(err)=> {
	if(err) {
		console.log('server error')
	}
})