const Like  =   require("../models/like");
const Post  =   require("../models/post");
const Comment   =   require("../models/comment");

module.exports.toggleLike   =   async function(request,response){
    try {
        //likes/toggle/?id=abcdef&type=Post

        let likeable;
        let deleted =   false;

        if(request.query.type   ==  "Post"){
            likeable    =   await Post.findById(request.query.id).populate('likes');
        }else{
            likeable    =   await Comment.findById(request.query.id).populate('likes');
        }

        // check if a like already exists
        let existingLike    =   await Like.findOne({
            likeable: request.query.id,
            onModel: request.query.type,
            user: request.user._id
        })

        //If a like already exist then delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.deleteOne();
            deleted =   true;
        }else{
            //else make a new like

            let newLike =   await Like.create({
                user: request.user._id,
                likeable: request.query.id,
                onModel: request.query.type
            });
            likeable.likes.push(newLike._id);
            likeable.save();
        }

        data: {
            deleted: deleted
        }

        return response.redirect('back');
        // return response.status(200).json({
        //      message: "Request Successful!",

        // })

    } catch (error) {
        console.log(error);
        return response.json(500,{
            message: 'Internal Server Error'
        });
    }
}