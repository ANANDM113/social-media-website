const mongoose  =   require('mongoose');

const likeSchema    =   new mongoose.Schema({
    //user which has liked the post
    user:{
        type: mongoose.Schema.ObjectId
    },
    //this defines the object Id of the liked object 
    likeable:{
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    //this field is used for defining the type of the liked object(either post or comment) 
    //since this is a dynamic reference
    onModel:{
        type: String,
        required: true,
        enum: ['Post','Comment']
    }
},{
    timestamps: true
});

const Like  =   mongoose.model('Like',likeSchema);
module.exports  =   Like;