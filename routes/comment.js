const express = require("express");
const router = express.Router();
const comment = require('../models/comment');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/checkAuth')
const jwt = require('jsonwebtoken');

// New comment
router.post('/',checkAuth,(req,res)=>{

    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token,'nkjdkfj');

    const newComment = new comment({
        _id: new mongoose.Types.ObjectId,
        userId: verify.userId,
        userName:verify.name,
        comment:req.body.comment,
        blogId:req.body.blogId
    });

    newComment.save()
    .then((result)=>{
        res.status(200).json({
            newComment:result,
        })
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})


// Edit your comment
router.put('/:id',checkAuth,(req,res)=>{

    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token,'nkjdkfj');
    
    // first find match document
    comment.find({_id:req.params.id, userId:verify.userId})
    .then(result=>{
        // Not found match docs
        if(result.length===0){
            return res.status(400).json({
                msg: "Something is wrong !!"
            });
        }
        // Found match docs
        comment.findOneAndUpdate({_id:req.params.id, userId:verify.userId},{
            $set:{
                userId: verify.userId,
                userName:verify.name,
                comment:req.body.comment,
                blogId:req.body.blogId     
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

// Delete own Comment
router.delete('/:id',(req,res)=>{

    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token,'nkjdkfj');

    // request ke params me jo id aa rha hai us id ke data ko delete krna hai
    // aur vhi user delete kre jo usse add kra hai
    comment.deleteOne({_id : req.params.id, userId:verify.userId})
    .then((result)=>{
        if (result.deletedCount === 0) {
            return res.status(404).json({ 
                msg: "No  any comment found to delete" 
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

// Get all comment of a blog
router.get("/getAllComments/:blogId",(req,res)=>{
    comment.find({blogId:req.params.blogId})
    .select("_id userId blogId userName comment")
    .then(result=>{
        res.status(200).json({
            comments:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})


module.exports = router;