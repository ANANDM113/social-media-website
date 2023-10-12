const passport  =   require('passport');
const googleStrategy    =   require('passport-google-oauth').OAuth2Strategy;
const crypto    =   require('crypto');
const User  =   require('../models/user');
const env = require('./environment');

//tell passport to use a new Startegy for google login
passport.use(new googleStrategy({
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_callback_url,
    },

    function(accessToken,refreshToken,profile,done){
        //Find a user
        User.findOne({email: profile.emails[0].value}).exec()
        .then((user) => {
            console.log(accessToken,refreshToken);
            console.log(profile);
            if(user){
                //If found, set this user as request.user
                return done(null,user);
            }else{
                //If not found, create this user and set it as request.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                },function(err,user){
                    if(err){
                        console.log('error in creating user google startegy-passport',err);
                        return;
                    }
                    return done(null,user);
                })
            }
        })
        .catch((error) => {
            console.log('error',error);
            return;
        })
    }
))

module.exports  =   passport;