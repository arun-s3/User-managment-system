const express = require('express');
const admin_route = express();

const { imageUploader } = require("../middlewares/imageUploader.js")

const session = require('express-session');
const config = require('../config/session.js')

const nocache = require("nocache")
admin_route.use(nocache())
admin_route.use(session({ secret: config.sessionSecret, resave: false, saveUninitialized: true }))

admin_route.use(express.json());
admin_route.use(express.urlencoded({extended: true}));

admin_route.use(express.static('assets'));


const adminController = require('../controllers/adminController.js');
const adminAuth = require('../middlewares/adminAuth.js');

admin_route.get('/', adminAuth.isLogout, adminController.loginLoad);

admin_route.post('/', adminController.verifyLogin);

admin_route.get('/home', adminAuth.isLogin, adminController.loadHome);
admin_route.get('/logout', adminAuth.isLogin, adminController.logout);

admin_route.get('/dashboard', adminAuth.isLogin, adminController.adminDashboard);

admin_route.get('/edit-self', adminAuth.isLogin, adminController.loadEditSelf);
admin_route.post("/edit-self", adminAuth.isLogin, imageUploader("/admin/edit-self"), adminController.editSelf)

admin_route.get('/new-user', adminAuth.isLogin, adminController.LoadNewUser);
admin_route.post("/new-user", adminAuth.isLogin, imageUploader("/admin/new-user"), adminController.addUser)

admin_route.get('/edit-user', adminAuth.isLogin, adminController.loadEditUser);
admin_route.post("/edit-user", adminAuth.isLogin, imageUploader(req => `/admin/edit-user?id=${req.body.id}`),
  adminController.updateUser)

admin_route.delete("/delete-user", adminAuth.isLogin, adminController.deleteUser)

admin_route.post("/search-user", adminAuth.isLogin, adminController.searchUser)
admin_route.get("/search-user", adminAuth.isLogin, adminController.searchAjaxUser)


admin_route.use((req, res) => {
    return res.redirect("/admin")
})

module.exports = admin_route;