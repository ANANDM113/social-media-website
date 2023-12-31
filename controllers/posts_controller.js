const Post  =   require('../models/post');
const Comment   =   require('../models/comment');
const Like  =   require('../models/like'); 

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
        let post    =  await Post.create({
            content: request.body.content,
            user: request.user._id
        });

        if(request.xhr){
            return response.status(200).json({
                data:{
                    post: post
                },
                message: "Post Created!"
            });
        }
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
            
        //Delete the associated likes for the post and all its comments likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});    
            await Like.deleteMany({_id: {$in: post.comments}});

            post.deleteOne();
    
            await Comment.deleteMany({post: request.params.id});

            if(request.xhr){
                return response.status(200).json({
                    data:{
                        //sending post id back to ajax function from server to frontend
                        post_id: request.params.id
                    },
                    message: "Post deleted"
                });
            }

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