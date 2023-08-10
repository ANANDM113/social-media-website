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