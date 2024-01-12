const express = require("express");
const app = express();
const path = require("path")


const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/ums-db");
// app.set("/assets",express.static(path.join(__filename,"/assets"))) 

app.use('/', require("./routes/userRoute"));

app.listen(process.env.PORT||5000, ()=>console.log("The server is running..."));