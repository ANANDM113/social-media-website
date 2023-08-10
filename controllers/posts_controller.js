const Post  =   require('../models/post');

module.exports.create   =   function(request,response){
    Post.create({

        content: request.body.content, //This is the name section in form in home.ejs
        user: request.user._id //This user is passed by setAuthenticated function,
                                // it pass the user to the views and we are accessing it
    })
    .then(post =>{
        return response.redirect('back');
    })
    .catch((err) =>{
        console.log('Error in Posting');
    })
}