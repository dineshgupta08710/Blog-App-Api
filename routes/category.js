const express = require("express");
const router = express.Router();
const category = require('../models/category');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/checkAuth')
const jwt = require('jsonwebtoken');

// Add category Post Api
router.post('/',checkAuth,(req,res)=>{

    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token,'nkjdkfj');

    const newCategory = new category({
        _id: new mongoose.Types.ObjectId,
        userId: verify.userId,      //req.body.userId, //Now need to send the userId bcoz i'm getting from token
        title: req.body.title,
        imageUrl: req.body.imageUrl
    });

    newCategory.save()
    .then((result)=>{
        res.status(200).json({
            newCategory:result,
        })
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})

///   Get all Category get api
router.get('/',checkAuth,(req,res)=>{

    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token,'nkjdkfj');

    // I want to get all category of that user which is currently logged in 
    category.find({userId : verify.userId})
    .select("_id userId title imageUrl")  // Select that what i've to send from Server
    .then(result=>{
        res.status(200).json({
            categoryList: result
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});


/// Delete category 
router.delete('/:id',(req,res)=>{

    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token,'nkjdkfj');

    // request ke params me jo id aa rha hai us id ke data ko delete krna hai
    // aur vhi user delete kre jo usse add kra hai
    category.deleteOne({_id : req.params.id, userId:verify.userId})
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


// Update category api
router.put('/:id',checkAuth,(req,res)=>{

    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token,'nkjdkfj');
    
    // first find match document 
    category.find({_id:req.params.id, userId:verify.userId})
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
                userId : verify.userId, // Not changing userId 
                title : req.body.title, // title change with request body title
                imageUrl : req.body.imageUrl // imageUrl change with request body imageUrl
                
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


/// Export the router so that app can listen it
module.exports = router;