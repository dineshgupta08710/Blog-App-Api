const express = require("express");
const router = express.Router();
const blog = require('../models/blog');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/checkAuth')
const jwt = require('jsonwebtoken');

// Add new blog
router.post('',checkAuth,(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token,'nkjdkfj');

    const newBlog = new blog({
        _id: new mongoose.Types.ObjectId,
        userId: verify.userId,      //req.body.userId, //Now need to send the userId bcoz i'm getting from token
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        categoryId:req.body.categoryId,
        categoryTitle:req.body.categoryTitle,
        blogDetails:req.body.blogDetails,
        blogEditor:verify.name, // editor name taking from token
    });

    newBlog.save()
    .then((result)=>{
        res.status(200).json({
            newBlog:result,
        })
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}
);

// get All blogs (Anyone can see blogs without login)
router.get('/getAllBlogs',(req,res)=>{
    blog.find()
    .select("_id userId categoryId categoryTitle title imageUrl userName")// selected thing which i have to sent
    .then(result=>{
        res.status(200).json({
            blogs:result
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
});

// get All blogs by Category
router.get('/getByCategory:id',(req,res)=>{
    // find all blog whose categoryId is matched with req ke categoryId se
    blog.find({categoryId : req.params.id})
    .select("_id userId categoryId categoryTitle title imageUrl userName")// selected thing which i have to sent
    .then(result=>{
        res.status(200).json({
            blogs:result
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})

// Get own blogs
router.get('/',checkAuth,(req,res)=>{

    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token,'nkjdkfj');

    // I want to get all blogs of that user which is currently logged in 
    blog.find({userId : verify.userId})
    .select("_id userId categoryId categoryTitle title imageUrl userName")  // Select that what i've to send from Server
    .then(result=>{
        res.status(200).json({
            blogList: result
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});


// Delete own blogs
router.delete('/:id',(req,res)=>{

    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token,'nkjdkfj');

    // request ke params me jo id aa rha hai us id ke data ko delete krna hai
    // aur vhi user delete kre jo usse add kra hai
    blog.deleteOne({_id : req.params.id, userId:verify.userId})
    .then((result)=>{
        if (result.deletedCount === 0) {
            return res.status(404).json({ 
                msg: "No matching document found to delete" 
            });
        }
        res.status(200).json({
            msg:"Deleted Successfully" 
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});

// Update own blog
router.put('/:id',checkAuth,(req,res)=>{

    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token,'nkjdkfj');
    
    // first find match document 
    blog.find({_id:req.params.id, userId:verify.userId})
    .then(result=>{
        // Not found match docs
        if(result.length===0){
            return res.status(400).json({
                msg: " Matching document not found..."
            });
        }
        // Found match docs
        category.findOneAndUpdate({_id:req.params.id, userId:verify.userId},{
            $set:{
                userId: verify.userId,
                title: req.body.title,
                imageUrl: req.body.imageUrl,
                categoryId:req.body.categoryId,
                categoryTitle:req.body.categoryTitle,
                blogDetails:req.body.blogDetails,
                blogEditor:verify.name,              
            }
        })
        .then(result=>{
            res.status(200).json({
                msg : result
            })
        })
        .catch(err=>{
            console.log(error);
            res.status(500).json({
                error:err
            })
        })
    })
    
})

module.exports = router;

