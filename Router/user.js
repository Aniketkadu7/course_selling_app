const {Router} = require("express");
const express = require("express");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {JWT_USER_PASSWORD} = require("../config");
const {z} = require("zod");
userRouter.use(express.json());
const {usermiddleware} = require("../middlewares/user");
const {userModel, courseModel,purchaseModel} = require("../db");
const course = require("./course");


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
        }, JWT_USER_PASSWORD);

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

userRouter.get("/courses", async function(req,res){
    const courses = await courseModel.find({});
    res.json({
        courses
    })

})

userRouter.post("/purchaseCourse",usermiddleware,  async function(req, res){
    const {title} = req.body;
    const userid = req.userid;

    const course = await courseModel.findOne({title : title});
    if(course){
        await purchaseModel.create({
            userId : userid,
            courseId : course._id
        })

        res.json({
            msg : "Course purchased successfully."
        })
    }else{
        res.json({
            msg : "Please enter correct course details"
        })
    }



})

userRouter.get("/purchases", usermiddleware, async function(req,res){
    const userid = req.userid;
    const purchases = await purchaseModel.find({userId : userid});
    if(purchases){
        const courseids = await purchases.map(p => p.courseId);
        const courses  = await courseModel.find({_id : { $in : courseids}});
        res.json({
            courses
        })
    }else{
        res.json({
            msg : "No courses found"
        })
    }
})

userRouter.get("/profile", usermiddleware, async function(req, res) {
    try {
        const userId = req.userid;
        const user = await userModel.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }
        
        res.json({
            user
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error fetching profile"
        });
    }
});

userRouter.put("/profile", usermiddleware, async function(req, res) {
    try {
        const userId = req.userid;
        const { firstName, lastName, username } = req.body;
        
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { firstName, lastName, username },
            { new: true }
        ).select('-password');
        
        res.json({
            msg: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error updating profile"
        });
    }
});

module.exports = {
    userRouter : userRouter
}