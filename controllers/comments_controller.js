const Comment   =   require('../models/comment');
const Post  =   require('../models/post');
const commentsMailer    =   require('../mailers/comments_mailer');
const queue =   require('../config/kue');
const commentEmailWorker    =   require('../workers/comment_email_worker');
const Like  =   require('../models/like');
/*
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
*/

module.exports.create   =   async function(request,response){
    
    try {
        let post    =   await Post.findById(request.body.post);
    
        if(post){
            let comment =   await Comment.create({
                content: request.body.content,
                post: request.body.post,
                user: request.user._id
            });
            post.comments.push(comment);
            post.save();
            comment =   await comment.populate('user','name email');
            
            let job =   queue.create('emails',comment).save(function(err){
                if(err){
                    console.log('error in sending to the queue',err);
                    return;
                }
                console.log('job enqueued',job.id);
            });
            // commentsMailer.newComment(comment);

            if (request.xhr){
                
                return response.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }
            request.flash('success', 'Comment published!');

            response.redirect('/');
        }
    } catch (error) {
        console.log('Error',error);
        return;
    }
}

/*
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
*/

module.exports.destroy  =   async function(request,response){

    try {
        let comment =  await Comment.findById(request.params.id);
        if(comment.user ==  request.user.id){
            let postId  =   comment.post;
            comment.deleteOne();
    
            let post    =  await Post.findByIdAndUpdate(postId,{$pull:{comments:request.params.id}});

            //Change: Destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            // send the comment id which was deleted back to the views
            if (request.xhr){
                return response.status(200).json({
                    data: {
                        comment_id: request.params.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success', 'Comment deleted!');

            return response.redirect('back');
        }else{
            return response.redirect('back');
        }
    } catch (error) {
        console.log('Error',error);
        return;
    }
}