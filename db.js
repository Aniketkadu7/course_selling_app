const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

user  = new Schema({
    email : {type :String, unique:true},
    password : String,
    username : String,
    firstName : String,
    lastName : String,
    __id : ObjectId
});

admin = new Schema({
    email : {type :String, unique:true},
    password : String,
    username : String,
    firstName : String,
    lastName : String,
    __id : ObjectId


})

course = new Schema({
    title : String,
    price : Number,
    description : String,
    creatorid : ObjectId

})

purchase = new Schema({
    __id : ObjectId,
    userId : ObjectId,
    coursId : ObjectId
})

const userModel = mongoose.model("user",user);
const adminModel = mongoose.model("admin", admin);
const courseModel = mongoose.model("course", course);
const purchaseModel = mongoose.model("purchase",purchase);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}