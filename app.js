const express = require('express');
const app = express();
const morgan =require('morgan');
const bodyParser = require('body-parser');


 const register_Routes = require('./api/routes/register');
 const login_Routes = require('./api/routes/login');



const mongoose = require('mongoose');

const mongid='mongodb://localhost/kiitprj';
const mong='mongodb+srv://kiitminor:<password>@kiitminor.gawin.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose
  .connect(mongid, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    console.log('Connected to database!'); 
  })
  .catch(error => {
    console.log('Connection failed!');
    console.log(error);
  });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-with,Content-Type,Accept,Authorization");
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});


app.use('/register',register_Routes);
app.use('/login',login_Routes);


app.use((req,res,next) =>{
     const error = new Error('Not Found');
     error.status=404;
     next(error);
 });
 
 app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error: {
            message: error.message
        }
    });
 });

 module.exports = app;