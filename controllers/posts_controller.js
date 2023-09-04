const Post  =   require('../models/post');
const Comment   =   require('../models/comment');

//By Using then catch
/*
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
*/

//By using async await
module.exports.create   =   async function(request,response){
    try {
        await Post.create({
            content: request.body.content,
            user: request.user._id
        });
        request.flash('success','Post published');
        return response.redirect('back');        
    } catch (error) {
        request.flash('error',error);
        return;
    }

}

/*
module.exports.destroy  =   function(request,response){
    //checking whether the post exist or not
    Post.findById(request.params.id)
    .then((post) => {

        //We are checking only that user should be able to delete the post who has written it
        // .id means converting the object is ._id(objectType) into string
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
*/

module.exports.destroy  =   async function(request,response){
    
    try {
        let post =   await Post.findById(request.params.id);
    
        if(post.user    ==  request.user.id){
            post.deleteOne();
    
            await Comment.deleteMany({post: request.params.id});
            request.flash('success','Post and assosciated comments deleted');
            return response.redirect('back');
        }else{
            request.flash('error','You cannot delete this post');
            return response.redirect('back');
        }
    } catch (error) {
        request.flash('error',error);
        return;
    }
}