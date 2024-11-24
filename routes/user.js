const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const user = require("../models/user");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Signup Post Api
router.post('/signup',async(req,res)=> {
    console.log("user signup post req..");
    console.log(req.body);

    // Checking that user is already exists or not
    const existingUser = await user.findOne({email:req.body.email}); // await to return some value
    if(existingUser){
        return res.status(400).json({
            msg:"User with same email is alredy exists!"
        });
    }

    // Converting password into hashcode 
    const hashedPassword = await bcryptjs.hash(req.body.password,8);

    const newUser = new user({
        _id: new mongoose.Types.ObjectId,
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword,
    });
    newUser.save()
    .then(result=>{
        res.status(200).json({
            newUser:result
        })
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});

// login
router.post('/login',(req,res)=>{
    console.log(req.body);

    user.find({email:req.body.email})
    .then(userResult=>{
        console.log(userResult);
        // if email does not exist in DB
        if(userResult.length<1){
            console.log("User does not exist !!!")
            return res.status(401).json({
                msg:"User does not exist!!"
            })
        }

        // Checking password
        bcryptjs.compare(req.body.password,userResult[0].password,(err,isMatch)=>{
            // If password not matched
            if(!isMatch){
                return res.status(401).json({
                    msg:'Invalid Password !!'
                })
            }

            // Password matched
            // Create token
            const token = jwt.sign(
                { name: userResult[0].name,
                     userId: userResult[0]._id, 
                     email: userResult[0].email
                }, // Payload
                'nkjdkfj', // Secret key
                { expiresIn: '365d'} // Expiry time
            );

            res.status(200).json({
                name:userResult[0].name,
                userId: userResult[0]._id,
                email:userResult[0].email,
                token:token
            });

        })
    })
    .catch((err)=>{
        console.log(err);
    })
});

module.exports = router;