const express = require("express");
const mongoose = require("mongoose");
const app = express();
const {userRouter} = require("./Router/user");
const {courseRouter} = require("./Router/course");
const {adminRouter} = require("./Router/admin");
const jwt = require("jsonwebtoken");
const mongo = require("mongoose");
app.use(express.json());

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);


async function main(){
    await mongoose.connect("mongodb+srv://Sersei7:serseiisme@cluster0.wsolr.mongodb.net/course_Selling_app");
    app.listen(3000);
}

main();

