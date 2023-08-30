const Post  =   require('../models/post');
const Comment   =   require('../models/comment');

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

module.exports.destroy  =   function(request,response){
    //checking whether the post exist or not
    Post.findById(request.params.id)
    .then((post) => {

        //We are checking only that user should be able to delete the post who has written it
        // .id means converting the object is ._id into string
        if(post.user == request.user.id){
            post.deleteOne();
            Comment.deleteMany({post: request.params.id})
            .then(() =>{
                return response.redirect('back');
            })
        }else{
            return response.redirect('back');
        }
    })
}