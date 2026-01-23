const express = require('express');
const admin_route = express();

const session = require('express-session');
const config = require('../config/config.js')
const nocache = require("nocache")
admin_route.use(nocache())
admin_route.use(session({secret: config.sessionSecret,
                         resave:false,
                         saveUninitialized:true}));
admin_route.use(express.json());
admin_route.use(express.urlencoded({extended: true}));

admin_route.use(express.static('assets'));

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, path.join(__dirname,'../assets') );
    },
    filename: (req,file,cb)=>{
        cb(null, Date.now()+'-'+file.orginalname);
    }
})
const upload = multer({storage:storage});

const adminController = require('../controllers/adminController.js');
const adminAuth = require('../middlewares/adminAuth.js');

admin_route.get('/', adminAuth.isLogout, adminController.loginLoad);

admin_route.post('/', adminController.verifyLogin);

admin_route.get('/home', adminAuth.isLogin, adminController.loadDashboard);
admin_route.get('/logout', adminAuth.isLogin, adminController.logout);

admin_route.get('/dashboard', adminAuth.isLogin, adminController.adminDashboard);
admin_route.get('/edit-self', adminAuth.isLogin, adminController.loadEditSelf);
admin_route.post('/edit-self', upload.single('image'), adminController.editSelf);

admin_route.get('/new-user', adminAuth.isLogin, adminController.LoadNewUser);
admin_route.post('/new-user', upload.single('image'), adminController.addUser);
admin_route.get('/edit-user', adminAuth.isLogin, adminController.loadEditUser);
admin_route.post('/edit-user', upload.single('image'), adminController.updateUser);
admin_route.get('/delete-user', adminController.deleteUser);
admin_route.post('/search-user', adminController.searchUser);

admin_route.get('/*', (req,res)=>{
    res.redirect('/admin');
})

module.exports = admin_route;