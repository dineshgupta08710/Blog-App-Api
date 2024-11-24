const mongoose = require('mongoose');

// Schema of category
const categorySchema = new mongoose.Schema({
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
    }
   
});

// creating model of schema
const Category = mongoose.model('Category',categorySchema);

module.exports = Category;