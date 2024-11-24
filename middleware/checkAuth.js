const jwt = require('jsonwebtoken');


module.exports = (req,res,next)=>{
    try {
        // Taking token from req Headers
        const token = req.headers.authorization.split(" ")[1];
        console.log(`Token : ${token}`);

        // Verifying token
        const verify = jwt.verify(token,'nkjdkfj');
        console.log(verify);
        // If verification completed it allows for next.
        if(verify){
            next(); 
        }

    } catch (error) {
        return res.status(401).json({
            msg:"Invalid token"
        })
    }
}