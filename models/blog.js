const mongoose = require('mongoose');

// Schema of blog
const blogSchema = new mongoose.Schema({
    _id:  mongoose.Schema.Types.ObjectId,
    userId: {
        type:String,
        required:true,
    },
    title: {
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true
    },
    categoryTitle:{
        type:String,
        required:true
    },
    categoryId:{
        type:String,
        required:true
    },
    blogDetails:{
        type:String,
        required:true
    },
    blogEditor:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
   
});

// creating model of schema
const Blog = mongoose.model('Blog',blogSchema);

module.exports = Blog;