const {Router} = require("express");
const express = require("express");
const {z} = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { adminModel, courseModel } = require("../db");
const {JWT_ADMIN_PASSWORD} = require("../config");
const adminRouter = Router();

adminRouter.use(express.json());

adminRouter.post("/login", async function(req,res){
    const {email,password} = req.body;
    const user = await adminModel.findOne({
        email:email
    })

    if(!user){
        res.json({
            msg : "Incorrect Credentials."
        })
        return;
    }

    const pwd = await bcrypt.compare(password,user.password);
    if(pwd){
        const token = jwt.sign({
            id : user._id.toString()
        }, JWT_ADMIN_PASSWORD);

        res.json({
            token : token
        })
    }else{
        res.json({
            msg : "Incorrect Credentials"
        })
    }

})

adminRouter.post("/signup", async function(req,res){
    const requiredBody = z.object({
        email : z.string().min(5).max(40).email(),
        fname : z.string().min(2).max(30),
        lname : z.string().min(2).max(30),
        username : z.string().min(6).max(18),
        password : z.string().min(5).max(20).refine((password)=> /[A-Z]/.test(password),{
            msg : "Password must have atleast one uppercase character"
        }).refine((password)=> /[a-z]/.test(password), {
            msg : "Password must have atleast one lowercase character"
        }).refine((password)=> /[0-9]/.test(password), {
            msg : "Password must have atleast oen digit"
        }).refine((password)=> /[!@#$%&]/.test(password), {
            msg : "Password must contain atleast one special character."
        })

    });

    const successBody = await requiredBody.safeParse(req.body);

    if(!successBody.success){
        res.json({
            msg : "Please enter data in valid format",
            error : successBody.error
        })
        return;
    }

    const {username,email,password,fname,lname} = req.body;

    const hashpwd = await bcrypt.hash(password,10);

    try{
        await adminModel.create({
            email,
            username,
            firstName : fname,
            lastName : lname,
            password : hashpwd
        })
    }catch(e){
        res.json({
            msg : "Signup request failed."
        })
        return;
    }

    res.json({
        msg : "You have successfully signed up."
    }) 

})

adminRouter.post("/course", async function(req,res){
    const adminId = req.userid;
    const {title,description,price,imageURL} = req.body;

    const course = await courseModel.create({
        title,
        description,
        price,
        imageURL,
        creatorid : adminId

    })

    res.json({
        msg : "Course successfully created",
        courseId : course._id
    })

})

adminRouter.put("/course", async function(req,res){
    const {title,description,price,imageURL,courseId} = req.body;

    const course = await courseModel.findOne({
        courseId : courseId
    })

    if(course){
        courseModel.updateOne({ courseId : courseId  }, {
            $set : {
                title,
                imageURL,
                price,
                description
            }
        })

        res.json({
            msg : "Course updated"
        })
    }else{
        res.status(403).json({
            msg : "No such course found"
        })
    }

    
})

adminRouter.get("/courses/bulk", async function(req,res){

})


module.exports = {
    adminRouter : adminRouter
}