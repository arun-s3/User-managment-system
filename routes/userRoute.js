const express = require("express");
const user_route = express();
const multer = require("multer")
const path = require("path")


user_route.use(express.json());
user_route.use(express.urlencoded({extended:true}));

user_route.set('view engine','ejs')
// user_route.set('views','../views/users');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,path.join(__dirname,"../assets"))
    },
    filename: (req,file,cb)=>{cb(null, Date.now()+'-'+file.originalname)}

});

const upload = multer({storage:storage});

const userController = require("../controllers/userController");

user_route.get('/register', userController.loadRegister);
user_route.post('/register', upload.single('image'), userController.insertUser);

user_route.get('/', userController.loginLoad);
user_route.get('/login',userController.loginLoad);

user_route.post('/login', userController.verifyLogin);
user_route.get('/home', userController.loadHome);

module.exports = user_route;