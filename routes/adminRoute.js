const express = require('express');
const admin_router = express.Router()

const adminAuth = require("../middlewares/adminAuth.js")
const { imageUploader } = require("../middlewares/imageUploader.js")

const adminController = require('../controllers/adminController.js');


admin_router.get('/', adminAuth.isLogout, adminController.loginLoad);

admin_router.post('/', adminController.verifyLogin);

admin_router.get('/home', adminAuth.isLogin, adminController.loadHome);
admin_router.get('/logout', adminAuth.isLogin, adminController.logout);

admin_router.get('/dashboard', adminAuth.isLogin, adminController.adminDashboard);

admin_router.get('/edit-self', adminAuth.isLogin, adminController.loadEditSelf);
admin_router.post("/edit-self", adminAuth.isLogin, imageUploader("/admin/edit-self"), adminController.editSelf)

admin_router.get('/new-user', adminAuth.isLogin, adminController.LoadNewUser);
admin_router.post("/new-user", adminAuth.isLogin, imageUploader("/admin/new-user"), adminController.addUser)

admin_router.get('/edit-user', adminAuth.isLogin, adminController.loadEditUser);
admin_router.post("/edit-user", adminAuth.isLogin, imageUploader(req => `/admin/edit-user?id=${req.body.id}`),
  adminController.updateUser)

admin_router.delete("/delete-user", adminAuth.isLogin, adminController.deleteUser)

admin_router.post("/search-user", adminAuth.isLogin, adminController.searchUser)
admin_router.get("/search-user", adminAuth.isLogin, adminController.searchAjaxUser)


module.exports = admin_router;