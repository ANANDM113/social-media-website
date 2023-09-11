const User  =   require("../models/user");
const fs    =   require('fs'); //filesystem
const path  =   require('path');


module.exports.profile  =   function(request,response){
    // response.end('<h1>User Profile</h1>');

    User.findById(request.params.id)
    .then((user) => {
        return response.render('users_profile',{
            title: "User Profile",
            profile_user: user
        })
    });
}

//updating name and email in profile page
/*
module.exports.update   =   function(request,response){
    if(request.user.id  ==  request.params.id){
        User.findByIdAndUpdate(request.params.id,request.body)
        .then((user) => {
            return response.redirect('back');
        })
    }else{
        return response.status(401).send('Unauthorized');
    }
}
*/

module.exports.update   =   async function(request,response){
    if(request.user.id  ==  request.params.id){
        try {
            let user    =   await User.findById(request.params.id);
            User.uploadedAvatar(request,response,function(err){
                if(err){
                    console.log('Multer Error',err);
                }
                user.name   =   request.body.name;
                user.email  =   request.body.email;

                if(request.file){
                    // Now the previous uploaded file will go away and new file will take its place
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                }

                //In not every request we will be uploading file so we put a check
                if(request.file){
                    //this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar =   User.avatarPath +   '/' +request.file.filename;
                }
                user.save();
                return response.redirect('back');
            })
        } catch (error) {
            request.flash('error',error);
            return response.redirect('back');
        }
    }else{
        request.flash('error','Unauthorized!');
        return response.status(401).send('Unauthorized!');
    }
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
    request.flash('success','Logged in Successfully');
    return response.redirect('/');
}

//SignOut
module.exports.destroySession   =   function(request,response){
    request.logout(function(err){
        if(err){
            return next(err);
        }
        request.flash('success','Logged out Successfully');
        return response.redirect('/')
    });
}