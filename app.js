 const express = require("express");
 const app = express();
 const mongoose = require('mongoose');
 const bodyParser = require('body-parser')

 const cors = require('cors');
 app.use(cors());

 const corsConfig = {
   origin:"*",
   Credential: true,
   methods:["GET","POST","PUT","DELETE"]
 }

 app.options("",cors(corsConfig));

 // connecting to database
 // '#' char in url =>  %23
 mongoose.connect('mongodb+srv://dinesh:Dinesh%237068@blog.kzfcj.mongodb.net/?retryWrites=true&w=majority&appName=Blog')
 .then(()=>{
    console.log("Database connectesd successfuly");
 }).catch((err)=>{
    console.log(err);
 });

 app.use(bodyParser.json());


 //## Importing  files from another folder
const userRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const blogRoute = require('./routes/blog');
const commentRoute = require('./routes/comment');

app.use('/user',userRoute);
app.use('/category',categoryRoute);
app.use('/blog',blogRoute);
app.use('/comment',commentRoute);

app.use("*",(req,res)=>{
   res.status(404).json({
      msg:"Bad request !!!"
   })
})

 module.exports = app;