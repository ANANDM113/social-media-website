const Post  =   require("../../../models/post");
const Comment   =   require("../../../models/comment");

module.exports.index    =   async function(request,response){
   
    let posts   =   await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
    path:'comments',
    populate:{
        path: 'user'
        }
    });
   
    return response.status(200).json({
        message: "List of posts",
        posts: posts
    })
}

module.exports.destroy  =   async function(request,response){
   
    try {
        let post =   await Post.findById(request.params.id);

       if(post.user ==  request.user.id){
            post.deleteOne();
    
            await Comment.deleteMany({post: request.params.id});

            return response.status(200).send('deleted');
            
        }else{
            return response.status(401).json({
                message:"you cannot delete this post!"
            })
        }
    } catch (error) {
        console.log('******',error);
        return response.json(500,{
            
            message: "Invalid error"
        });
    }
}



