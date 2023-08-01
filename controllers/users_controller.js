module.exports.profile  =   function(request,response){
    // response.end('<h1>User Profile</h1>');

    return response.render('users_profile',{
        title: "Profile"
    });
}