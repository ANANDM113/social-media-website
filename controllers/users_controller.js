const User  =   require("../models/user");

module.exports.profile  =   function(request,response){
    // response.end('<h1>User Profile</h1>');

    return response.render('users_profile',{
        title: "Profile"
    });
}

//Render the signUp Page
module.exports.signUp   =   function(request,response){
    if(request.isAuthenticated()){
       return response.redirect('/users/profile');
    }
    return response.render('user_sign_up',{
        title:"Codeial | Sign Up"
    })
}

//Render the signIn Page
module.exports.signIn   =   function(request,response){
    if(request.isAuthenticated()){
        return response.redirect('/users/profile');
     }
    return response.render('user_sign_in',{
        title:"Codeial | Sign In"
    });
}

//Getting SignUp Data
module.exports.create   =   function(request,response){

    if(request.body.password != request.body.confirm_password){
        return response.redirect('back');
    }

    User.findOne({email: request.body.email})
    .then((user) => {
        if(!user){
            User.create(request.body)
            .then(() =>{
                return response.redirect('/users/sign-in');
            })
            .catch((err) => {
                console.log('error in finding user in signing up');return
            })
        }else{
            return response.redirect('back');
        }
    })
    .catch((err) => {
        if(err){console.log('error in finding user in signing up');return}
    })
}

//Sign-In and create a session for the user
module.exports.createSession    =   function(request,response){
    return response.redirect('/');
}

//SignOut
module.exports.destroySession   =   function(request,response){
    request.logout(function(err){
        if(err){
            return next(err);
        }
        return response.redirect('/')
    });
}