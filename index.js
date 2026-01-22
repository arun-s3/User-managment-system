const express = require("express");
const app = express();
const path = require("path")
const nocache = require("nocache")

require("dotenv").config()

app.set("view engine","ejs")

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGOURI);
mongoose.connection.on("connected", ()=>{console.log("Connected to database..")})
mongoose.connection.on("disconnected", ()=>{console.log("/n Disconnected to database..")})
mongoose.connection.on("error", ()=>{console.log("/n Error in database connection..")})


app.use(nocache())
app.use("/public", express.static(path.join(__dirname, "/public")));

// app.use(express.static("public"))
app.use('/', require("./routes/userRoute"));
app.use('/admin', require("./routes/adminRoute"));

app.listen(process.env.PORT||5000, ()=>console.log("The server is running..."));