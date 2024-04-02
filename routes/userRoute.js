const express = require("express");
const user_route = express();
const multer = require("multer")
const path = require("path")

const session = require("express-session")
const config = require("../config/config.js")
const auth = require("../middlewares/auth.js")
const nocache = require("nocache");
user_route.use(nocache());
const year = new Date(2025);
user_route.use(session({secret: config.sessionSecret,
                        resave: false,
                        saveUninitialized:true}))

user_route.use(express.static('assets'))
// user_route.use(express.static('./public'))



user_route.use(express.json());
user_route.use(express.urlencoded({extended:true}));

// user_route.set('view engine','ejs')
// user_route.set('views','./views/users');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,path.join(__dirname,"../assets"))
    },
    filename: (req,file,cb)=>{cb(null, Date.now()+'-'+file.originalname)}

});

const upload = multer({storage:storage});

const userController = require("../controllers/userController");

user_route.get('/register', auth.isLogout, userController.loadRegister);
user_route.post('/register', upload.single('image'), userController.insertUser);

user_route.get('/', auth.isLogout, userController.loginLoad);
// user_route.get('/login', auth.isLogout,userController.loginLoad);

user_route.post('/', userController.verifyLogin);
user_route.get('/home', auth.isLogin, userController.loadHome);

user_route.get('/logout', auth.isLogin, userController.userLogout);

user_route.get('/edit', auth.isLogin, userController.editLoad);
user_route.post('/edit', upload.single('image'), userController.updateProfile);

module.exports = user_route;