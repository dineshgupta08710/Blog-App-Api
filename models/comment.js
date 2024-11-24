const mongoose = require('mongoose');

// Schema of category
const commentSchema = new mongoose.Schema({
    _id:  mongoose.Schema.Types.ObjectId,
    userId: {
        type:String,
        required:true,
    },
    userName:{
        type:String,
        required:true,
    },
    comment:{
        type:String,
        required:true,
    },
    blogId:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
   
});

// creating model of schema
const Comment = mongoose.model('Commnet',commentSchema);

module.exports = Comment;