const {Router} = require("express");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const {userModel} = require("../db");

userRouter.post("/login", function(req,res){

})

userRouter.post("/signup", function(req,res){
    username = req.body.username;
    password = req.body.password;
    fname = req.body.first_name;
    lname = req.body.last_name;
    email = req.body.email;

    
    
})

userRouter.get("/purchases", function(req,res){
    res.json({
        message : "Your puchases are as follows."
    })

})

module.exports = {
    userRouter : userRouter
}