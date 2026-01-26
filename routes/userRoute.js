const express = require("express");
const user_route = express();

const { imageUploader } = require("../middlewares/imageUploader.js")

const session = require("express-session")
const config = require("../config/session.js")

const auth = require("../middlewares/auth.js")

const nocache = require("nocache");
user_route.use(nocache());
user_route.use(
    session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: true,
    }),
)

user_route.use(express.static('assets'))

user_route.use(express.json());
user_route.use(express.urlencoded({extended:true}));

const userController = require("../controllers/userController");

user_route.get('/register', auth.isLogout, userController.loadRegister);
user_route.post("/register", imageUploader("/register"), userController.insertUser)

user_route.get('/', auth.isLogout, userController.loginLoad);
// user_route.get('/login', auth.isLogout,userController.loginLoad);

user_route.post('/', userController.verifyLogin);
user_route.get('/home', auth.isLogin, userController.loadHome);

user_route.get('/logout', auth.isLogin, userController.userLogout);

user_route.get('/edit', auth.isLogin, userController.editLoad);
user_route.post("/edit", imageUploader("/edit"), userController.updateProfile)

module.exports = user_route;