const express = require("express");
const user_router = express.Router();

const auth = require("../middlewares/auth.js")
const { imageUploader } = require("../middlewares/imageUploader.js")

const userController = require("../controllers/userController");


user_router.get('/register', auth.isLogout, userController.loadRegister);
user_router.post("/register", auth.isLogout, imageUploader("/register"), userController.insertUser)

user_router.get('/', auth.isLogout, userController.loginLoad);

user_router.post('/', userController.verifyLogin);
user_router.get('/home', auth.isLogin, userController.loadHome);

user_router.get('/logout', auth.isLogin, userController.userLogout);

user_router.get('/edit', auth.isLogin, userController.editLoad);
user_router.post("/edit", auth.isLogin, imageUploader("/edit"), userController.updateProfile)


module.exports = user_router;