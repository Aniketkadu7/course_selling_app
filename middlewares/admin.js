const jwt = require("jsonwebtoken");
const {JWT_ADMIN_PASSWORD} = require("../config");
function adminmiddleware(req,res,next){
    const token = req.headers.token;
    const info = jwt.verify(token,JWT_ADMIN_PASSWORD);

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
    adminmiddleware
}
