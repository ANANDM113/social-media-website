const mongoose  =   require('mongoose');

//Each post will be written by one user. So we will track the user by its object Id in the db
const postSchema    =   new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

const Post  =   mongoose.model('Post',postSchema);
module.exports  =   Post;