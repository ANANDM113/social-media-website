module.exports.profile  =   function(request,response){
    // response.end('<h1>User Profile</h1>');

    return response.render('users_profile',{
        title: "Profile"
    });
}

//Render the signUp Page
module.exports.signUp   =   function(request,response){
    return response.render('user_sign_up',{
        title:"Codeial | Sign Up"
    })
}

//Render the signIn Page
module.exports.signIn   =   function(request,response){
    return response.render('user_sign_in',{
        title:"Codeial | Sign In"
    });
}

//Getting SignUp Data
module.exports.create   =   function(request,response){

}

//Sign-In and create a session for the user
module.exports.createSession    =   function(request,response){

}