const passport  =   require('passport');
const JWTStrategy   =   require('passport-jwt').Strategy;
const ExtractJWT    =   require('passport-jwt').ExtractJwt;

const User  =   require('../models/user');

//secretOrKey is used to encrypt and decrypt the token
//Now header is a list of keys, header has a key called autherization that is also a list of keys which
//has a key called bearer which has actual jwt token so we are extracting it
//opts is options
//https://www.passportjs.org/packages/passport-jwt/
let opts    =   {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'codeial'
}

passport.use(new JWTStrategy(opts,function(jwtPayLoad,done){
    //jwtPayload has actual username, password. done is a callback function
    
    User.findById(jwtPayLoad._id)
    .then((user) =>{
        if(user){
            return (done,user);
        }else{
            return(null,false);
        }
    })
    .catch((err) =>{
        if(err){
            console.log('Error in finding user from JWT',err);
        }
    })
}));

module.exports  =   passport;