const jwt = require("jsonwebtoken");
const {JWT_USER_PASSWORD} = require("../config");
function usermiddleware(req,res,next){
    const token = req.headers.token;
    const info = jwt.verify(token,JWT_USER_PASSWORD);

    if(info){
        req.userid = info.id;
        next();
    }else{
        res.status(403).json({
            msg : "You are not authorized to access this page"

        })
    }
}

module.exports = {
    usermiddleware
}