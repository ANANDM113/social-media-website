const User  =   require("../../../models/user");
const jwt   =   require("jsonwebtoken");
const env   =   require('../../../config/environment');

module.exports.createSession    =   async function(request,response){

    try {
        let user    =   await User.findOne({email: request.body.email});

        if(!user    ||  user.password   !=  request.body.password){
            return response.json(422,{
                message: "Invalid username or password"
            });
        }

        return response.status(200).json({
            message:"Sign in successful, here is your token,keep it safe!",
            data:{
                token: jwt.sign(user.toJSON(),env.jwt_secret,{expiresIn: "1000000"})
            }
        })
    } catch (error) {
        console.log('******',error);
        return response.json(500,{
            message: "Internal Server Error"
        });
    }
}