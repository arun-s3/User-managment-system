const User = require('../models/userModel')
const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const randomstring = require('randomstring')
const getToast = require('../Utils/getToast')
const redirectWithToast = require("../Utils/redirectWithToast")


const securepassword = async(password)=>{
    try{
        const hashedPassword = await bcrypt.hash(password,10);
        return hashedPassword;
    }
    catch(error){
        console.error(error);
        throw new Error("Password encryption failed")
    }
} 


const loginLoad = async(req,res)=> {
    try{
        res.render('admin/login', { toast: getToast(req) })
    }
    catch(error){
        console.error(error)
        res.status(500).render("error/500")
    }
}


const verifyLogin = async(req,res)=> {
    try{
        const email = req.body.email
        const password = req.body.password
        
        const userData = await User.findOne({email:email}).lean()

        if(userData){
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if(passwordMatch){
                if(userData.is_admin){
                    req.session.admin = userData._id;
                    return redirectWithToast.success(req, res, "Welcome home!", "/admin/home")
                }
                else{ 
                    return redirectWithToast.error(req, res, "Access denied. This panel is for administrators only.", "/admin")
                }
            }
            else{
                return redirectWithToast.error(req, res, "Please verify your email id and password", "/admin")
            }
        }
        else{ 
            return redirectWithToast.error(req, res, "Please put a valid email address", "/admin")
        }
    }
    catch(error){
        console.error(error)
        return redirectWithToast.error(req, res, "Internal Server error. Please try again later.", "/admin")
    }
}


const loadHome = async(req,res)=>{
    try{
        const id = req.session.admin;
        const adminData = await User.findOne({ _id: id }).lean()

        res.render("admin/home", { admin: adminData, toast: getToast(req) })
    }
    catch(error){
        console.error(error)
        return redirectWithToast.error(req, res, "Internal Server error. Please try again later.", "/admin")
    }
}


const logout = async(req,res)=>{
    try{
        req.session.toast = {
            type: "success",
            message: "Logged out successfully!",
        }

        delete req.session.admin
        res.redirect("/admin")
    }
    catch(error){
        console.error(error)
        return redirectWithToast.error(req, res, "Internal Server error. Please try again later.", "/admin/home")
    }
}


const adminDashboard = async (req,res)=>{
    try{ 
        const usersData = await User.find({ is_admin: 0 }).lean() 
        const adminData = await User.findOne({ _id: req.session.admin, is_admin: 1 }).lean()
        res.render("admin/dashboard", { users: usersData, admin: adminData, toast: getToast(req) })
    }
    catch(error){
        console.error(error)
        return redirectWithToast.error(req, res, "Internal Server error. Please try again later.", "/admin/home")
    }
}


const loadEditSelf = async(req,res)=>{
    try{
        const admin = await User.findOne({ _id: req.session.admin }).lean()
        if(admin){
            res.render('admin/edit-self',{ admin:admin, toast: getToast(req) });
        }
    }
    catch(error){
        console.error(error)
        return redirectWithToast.error(req, res, "Internal Server error. Please try again later.", "/admin/home")
    }
}


const editSelf = async(req,res)=>{
    try{
        const id = req.body.id;
        const { name, email, mno: mobile, password } = req.body

        const spassword = await securepassword(password);
        if (!spassword) {
            return redirectWithToast.error(req, res, "Password encryption failed. Please try again.", "/admin/edit-self")
        }

        const user = await User.findById(id)
        
        if (user.email.trim() !== email.trim()) {
            const emailExists = await User.findOne({ email })
            if (emailExists) {
                return redirectWithToast.error(req, res, "Email id already exists. Please use another id.", "/admin/edit-self")
            }
        }

        if (user.mobile.toString().trim() !== mobile.toString().trim()) {
            const mobileExists = await User.findOne({ mobile })
            if (mobileExists) {
                return redirectWithToast.error(req, res, "Mobile number already exists. Please use another number.", "/admin/edit-self")
            }
        }

        await User.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    name,
                    email,
                    mobile,
                    password: spassword,
                    image: req?.file?.path ? req.file.path : user.image,
                },
            },
        )
        return redirectWithToast.success(req, res, "Updated profile successfully!", "/admin/home")
    }
    catch(error){
        console.error(error)
        return redirectWithToast.error(req, res, "Internal Server error. Please try again later.", "/admin/edit-self")
    }
}


const LoadNewUser= async(req,res)=>{
    try{
        const adminData = await User.findOne({ _id: req.session.admin, is_admin: 1 }).lean()
        res.render("admin/new-user", { admin: adminData.name, toast: getToast(req) })
    }
    catch(error){
        console.error(error)
        return redirectWithToast.error(req, res, "Internal Server error. Please try again later.", "/admin/dashboard")
    }
}


const addUser = async(req,res)=>{
    try{        
        const { name, email, mno: mobile, password } = req.body

        const spassword = await securepassword(password);
        if (!spassword) {
            return redirectWithToast.error(req, res, "Password encryption failed. Please try again.", "/admin/new-user")
        }

        const emailExists = await User.findOne({ email })
        if (emailExists) {
            return res.render("admin/new-user", {
                message: "Email already exists. Please use another email.", name, email, mobile,
            })
        }

        const mobileExists = await User.findOne({ mobile })
        if (mobileExists) {
            return res.render("admin/new-user", {
                message: "Mobile number already exists. Please use another number.", name, email, mobile
            })
        }
        
        const user = new User({
            name,
            email,
            mobile,
            image: req?.file?.path ? req.file.path : "/public/Images/defultProfilePic.jpg",
            password: spassword,
            is_admin: false,
        })
        
        const userData = await user.save();
        if(userData){
            return redirectWithToast.success(req, res, "Created new user successfully!", "/admin/dashboard")  
        }
    }
    catch(error){
        console.error(error);
        return redirectWithToast.error(req, res, "Internal Server error. Please try agan later", "/admin/new-user")
    }
}


const loadEditUser = async(req,res)=>{
    try{
        const id = req.query.id 
        const userData = await User.findById({ _id: id }).lean() 
        if(userData){
            res.render("admin/edit-user", { user: userData, toast: getToast(req) })
        }
        else{
            return redirectWithToast.error(req, res, "User not available", "/admin/dashboard")
        }
        
    }
    catch(error){
        console.error(error);
        return redirectWithToast.error(req, res, "Internal Server error. Please try agan later", "/admin/dashboard")
    }
}


const updateUser = async(req,res)=>{
    try{  
        const id = req.body.id;
        const { name, email, mno: mobile} = req.body

        const user = await User.findById(id)

        if (user.email.trim() !== email.trim()) {
            const emailExists = await User.findOne({ email })
            if (emailExists) {
                return redirectWithToast.error(req, res, "Email already exists. Please use another email.", "/admin/edit-user")
            }
        }

        if (user.mobile.toString().trim() !== mobile.toString().trim()) {
            const mobileExists = await User.findOne({ mobile })
            if (mobileExists) {
                return redirectWithToast.error(req, res, "Mobile number already exists. Please use another number.", "/admin/edit-user")
            }
        }

        await User.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    name,
                    email,
                    mobile,
                    image: req?.file?.path ? req.file.path : user.image,
                },
            },
        )
        return redirectWithToast.success(req, res, "Updated the user successfully!", "/admin/dashboard")
    }
    catch(error){
        console.error(error)
        return redirectWithToast.error(req, res, "Internal Server error. Please try agan later", "/admin/edit-user")
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.query.id

        await User.deleteOne({ _id: id })

        return res.json({ success: true, message: "Deleted the user successfully!",  id })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Internal Server error. Please try again later" })
    }
}

const searchUser = async (req, res) => {
    try {
        const searchData = req.body.search?.trim() || ""

        const admin = await User.findOne({ is_admin: 1 }).lean()

        let result = []

        result = await User.find({
            name: { $regex: searchData, $options: "i" },
            is_admin: 0,
        }).lean()

        if (result.length === 0) {
            result = await User.find({
                email: { $regex: searchData, $options: "i" },
                is_admin: 0,
            }).lean()
        }

        if (result.length === 0) {
            result = await User.find({
                mobile: { $regex: searchData, $options: "i" },
                is_admin: 0,
            }).lean()
        }

        res.render("admin/dashboard", { users: result.length ? result : null, admin, toast: getToast(req) })
    } 
    catch (error) {
        console.error(error)
        return redirectWithToast.error(req, res, "Internal Server error. Please try again later", "/admin/dashboard")
    }
}


const searchAjaxUser = async (req, res) => {
    try {
        const searchData = req.query.search?.trim() || ""

        if (!searchData) {
            const users = await User.find({ is_admin: 0 }).lean()
            return res.json(users)
        }

        let result = []

        result = await User.find({
            name: { $regex: searchData, $options: "i" },
            is_admin: 0,
        }).lean()

        if (result.length === 0) {
            result = await User.find({
                email: { $regex: searchData, $options: "i" },
                is_admin: 0,
            }).lean()
        }

        if (result.length === 0 && /^\d+$/.test(searchData)) {
            result = await User.find({
                $expr: {
                    $regexMatch: {
                        input: { $toString: "$mobile" },
                        regex: searchData,
                    },
                },
                is_admin: 0,
            }).lean()
        }

        res.json(result)
    }
    catch (error) {
        console.error(error)
        res.status(500).json([])
    }
}



module.exports = {loginLoad, verifyLogin, loadHome, logout, adminDashboard, loadEditSelf, editSelf,
                  LoadNewUser, addUser, loadEditUser, updateUser, deleteUser, searchUser, searchAjaxUser}