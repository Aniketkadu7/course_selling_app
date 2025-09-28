require('dotenv').config();
const express = require("express");
const mongo = require("mongoose");
const path = require("path");
const { userRouter } = require("./Router/user");
const { courseRouter } = require("./Router/course");
const { adminRouter } = require("./Router/admin");
const app = express();
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/dist')));

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

async function main(){
    await mongo.connect(process.env.MONGO_URL);
    app.listen(3000);
    console.log("listening on port 3000");
}

main()

