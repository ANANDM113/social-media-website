const express   =   require('express');
const cookieParser  =   require('cookie-parser');
const app   =   express();
const port  =   8000;
const expressLayouts    =   require('express-ejs-layouts');
const db    =   require('./config/mongoose');

//used for session cookie
const session   =   require('express-session');
const passport  =   require('passport');
const passportLocal =   require('./config/passport-local-startegy');

//to store session cookie
const MongoStore    =   require('connect-mongo');

//MiddleWare
app.use(express.urlencoded());
app.use(cookieParser());

//Accessing Static files
app.use(express.static('./assets')); 

//Using Layout Library
app.use(expressLayouts);

//extract styles and scripts from sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



//set up the view engine
app.set('view engine','ejs');
app.set('views','./views'); //path where to look

app.use(session({
    name: "codeial",
    //TODO change the secret before deployment in production mode
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge: (1000*60*100)
    },
    store: MongoStore.create(
        {
        mongoUrl: 'mongodb://127.0.0.1/codeial_development',
        autoRemove: 'disabled'
    },function(err){
        console.log(err || 'connect-mongodb setup ok');
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//Using the express router imported from routes/index.js
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log(`Error in running server: ${err}`);
    }
    console.log(`Server is running on: ${port}`);
});