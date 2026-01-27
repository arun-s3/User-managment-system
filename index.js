const express = require("express");
const app = express();

const mongoose = require("mongoose")

const path = require("path")
const nocache = require("nocache")
const compression = require("compression")
const session = require("express-session")

const config = require("./config/session.js")

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development"

require("dotenv").config({
    path: path.resolve(process.cwd(), envFile),
})

app.set("view engine","ejs")

if (process.env.NODE_ENV === "production") {
    app.set("view cache", true)
}

app.use(compression())

if (process.env.NODE_ENV !== "production") {
    app.use(nocache())
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
    session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: true,
    }),
)

app.use( "/public", express.static(path.join(__dirname, "public"), {
        maxAge: "7d",
        immutable: true,
    }),
)

mongoose.connect(process.env.MONGOURI);
mongoose.connection.on("connected", ()=>{console.log("Connected to database..")})
mongoose.connection.on("error", ()=>{console.log("/n Error in database connection..")})


app.get("/health", (req, res) => {
    res.send("OK")
})

app.use("/admin", require("./routes/adminRoute"))
app.use('/', require("./routes/userRoute"));

app.use("*", (req, res) => {
    res.status(404).render("error/404")
})


app.listen(process.env.PORT || 5000, ()=>console.log("The server is running..."));