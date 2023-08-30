const Comment   =   require('../models/comment');
const Post  =   require('../models/post');

module.exports.create   =   function(request,response){
    Post.findById(request.body.post)
    .then((post) =>{
        if(post){ //if the post exist
            Comment.create({ //then create comment
                content: request.body.content,
                post: request.body.post,
                user: request.user._id
            })
            .then((comment) => { //then push the comment
                post.comments.push(comment); //pushing the comment id in comments[] in post Schema
                post.save(); //We need to save it when we update something in a already made schema

                response.redirect('/');
            })
            .catch((err) =>{
                console.log('Error in creating comment');
            })
        }
    })
}

module.exports.destroy  =   function(request,response){
    Comment.findById(request.params.id)
    .then((comment) => {
        if(comment.user ==  request.user.id){
            let postId  =   comment.post;
            comment.deleteOne();

            Post.findByIdAndUpdate(postId,{$pull: {comments: request.params.id}})
            .then((post) => {
                return response.redirect('back');
            })
        }else{
            return response.redirect('back');
        }
    })
}