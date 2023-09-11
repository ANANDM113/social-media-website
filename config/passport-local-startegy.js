//https://www.passportjs.org/packages/passport-local/
const passport  =   require('passport');

const LocalStrategy =   require('passport-local').Strategy;
const User  =   require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
function(request,email,password,done){
    //find a user and establish the identity
    User.findOne({email:email})
    .then((user) =>{
        if(!user    ||  user.password   !=  password){
            request.flash('success','Invalid Username/Password');
            return done(null,false);
        }
        return done(null,user);
    })
    .catch((err) =>{
        if(err){
            request.flash('error',err);
            return done(err);
        }
    });
}
));

//serializing the user to decide which key is to be kept in the cookies
//Here we are setting user id as a key in the session key although it is not encrpted
//for encrypting the cookie we will use express session
// express-session also creates the session cookie
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id)
    .then((user) => {
        return done(null,user);
    })
    .catch((err) => {
        if(err){
            console.log('Error in finding user --> passport');
            return done(err);            
        }
    })
});

//check if the user is authenticated middleware
passport.checkAuthentication    =   function(request,response,next){
    //if the user is signed in, then pass on the request to the next function(controllers's action)
    if(request.isAuthenticated()){
        return next();
    }
    //if the user is not signed in
    return response.redirect('/users/sign-in');
}
//middleware to access the authenticated user in the views
passport.setAuthenticatedUser   =   function(request,response,next){
    if(request.isAuthenticated()){
        //request.user contains the current signed in user from the session cookie and we are 
        //just sending this to the locals for the views
        response.locals.user =   request.user;
    }
    next();
}
module.exports  =   passport;