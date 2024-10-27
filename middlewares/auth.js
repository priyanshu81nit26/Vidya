const jwt=require("jsonwebtoken")
require("dotenv").config();

const User=require('../models/User')
// authentication:

exports.auth=async(req,res,next)=>{
        try {

                //extract token:
                const token=req.cookies.token
                        || req.body.token||
                        req.header("Authorisation").replace("Bearer ","");

                // if token is missing:
                if(!token)
                {
                    return res.status(401).json({
                       success:false,
                       message:"token is missing"
                   });

                }

                // verify token: we use jwt verify method;
                try {
                    const decode= jwt.verify(token,process.env.JWT_SECRET);
                    console.log(decode);
                    req.User=decode
                } catch (error) {
                        console.log(error)
                        return res.status(401).json({
                        success:false,
                        message:"token is invalid"
                    })
    
                    
                }

                next()

            
        } catch (error) {
            console.log(error)
            return res.status(401).json({
                success:false,
                message:"something went wromg whie validating the token:"
            });
            
        }
}

// is student;
exports.isStudent=async(req,res,next)=>{
        try {
            if(req.User.accountType!=="Student")
            {
                return res.status(401).json({
                    message:"this is protected route only for studens only",
                    success:false

                })
            }
            next();
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message:"user role cannot be verified",
                success:false
            })
        }
}

/// is instructor;
exports.isTeacher=async(req,res,next)=>{
    try {
        if(req.User.accountType!=="Instructor")
        {
            return res.status(401).json({
                message:"this is protected route only for instructor only",
                success:false

            })
        }
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"user role cannot be verified",
            success:false
        })
    }
}


// is admin
exports.isTeacher=async(req,res,next)=>{
    try {
        if(req.User.accountType!=="Admin")
        {
            return res.status(401).json({
                message:"this is protected route only for admin only",
                success:false

            })
        }
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"user role cannot be verified",
            success:false
        })
    }
}