const passport  =   require('passport');
const googleStrategy    =   require('passport-google-oauth').OAuth2Strategy;
const crypto    =   require('crypto');
const User  =   require('../models/user');

//tell passport to use a new Startegy for google login
passport.use(new googleStrategy({
        clientID: "667170214590-7clmdmd4o9cg3iv9dvh6g7fdtaiislou.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/users/auth/google/callback",
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