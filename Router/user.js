const {Router} = require("express");
const userRouter = Router();
const {userModel} = require("../db");

userRouter.post("/login", function(req,res){

})

userRouter.post("/signup", function(req,res){
    
})

userRouter.get("/purchases", function(req,res){
    res.json({
        message : "Your puchases are as follows."
    })

})

module.exports = {
    userRouter : userRouter
}