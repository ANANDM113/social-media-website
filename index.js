const express   =   require('express');
const env   =   require('./config/environment');
const logger    =   require('morgan');
const cookieParser  =   require('cookie-parser');
const app   =   express();
const port  =   8000;
const expressLayouts    =   require('express-ejs-layouts');
const db    =   require('./config/mongoose');

//used for session cookie
const session   =   require('express-session');
const passport  =   require('passport');
const passportLocal =   require('./config/passport-local-startegy');
const passportJWT   =   require('./config/passport-jwt-strategy');
const passportGoogle    =   require('./config/passport-google-oauth2-strategy');
//to store session cookie
const MongoStore    =   require('connect-mongo');

//sass-middleware
// const sassMiddleware    =   require('node-sass-middleware');

// app.use(sassMiddleware({
//     src: './assets/scss',
//     dest: './assets/css',
//     debug: true,
//     outputStyle: 'extended',
//     prefix: '/css'
// }));

//Flash message
const flash =   require('connect-flash');

//Custom Middleware
const customMware   =   require('./config/middleware');

//set up the chat server to be used with Socket.io
const chatServer    =   require('http').Server(app);
const chatSockets   =   require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('Chat server is listening on port 5000');

//MiddleWare
app.use(express.urlencoded());
app.use(cookieParser());

//Accessing Static files
app.use(express.static(env.asset_path)); 

//make the file uploads path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'));

// For logging
app.use(logger(env.morgan.mode,env.morgan.options));

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
    secret: env.session_cookie_key,
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

app.use(flash());
app.use(customMware.setFlash);

//Using the express router imported from routes/index.js
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log(`Error in running server: ${err}`);
    }
    console.log(`Server is running on: ${port}`);
});