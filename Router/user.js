const {Router} = require("express");
const express = require("express");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_USER_SECRET = "userhumai";
const {z} = require("zod");
const {userModel} = require("../db");
userRouter.use(express.json());

// function auth(){
//     const token = req.headers.token;
//     const decodedInfo = token

// }


userRouter.post("/login", async function(req,res){
    const {email,password} = req.body;
    const user = await userModel.findOne({
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
        }, JWT_USER_SECRET);

        res.json({
            token : token
        })
    }else{
        res.json({
            msg : "Incorrect Credentials"
        })
    }

})

userRouter.post("/signup", async function(req,res){

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
        await userModel.create({
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

userRouter.get("/purchases", function(req,res){
    res.json({
        message : "Your puchases are as follows."
    })

})

module.exports = {
    userRouter : userRouter
}