const express = require("express");
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




app.listen(3000);