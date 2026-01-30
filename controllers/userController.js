const User = require("../models/userModel")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const getToast = require("../Utils/getToast")
const redirectWithToast = require("../Utils/redirectWithToast")


const securepassword = async(password)=>{
    try {
        return await bcrypt.hash(password, 10)
    }
    catch (error) {
        console.error(error)
        throw new Error("Password encryption failed")
    }
}


const loadRegister = async (req,res)=>{
    try{
        const isAdmin = req.query.admin === "true"

        res.render("users/registration", { isAdmin, toast: getToast(req) }) 
    }
    catch(error)
    {
        console.error(error);
        return redirectWithToast.error(req, res, "Internal Server error. Please try again later.", "/")
    }
}


const insertUser = async (req, res) => {
    try {
        const isAdmin = req.query.admin === "true"

        const emailExists = await User.findOne({ email: req.body.email })
        if (emailExists) {
            return res.render("users/registration", {
                message: "This email already exists. Please refill the form!", name: req.body.name, mobile: req.body.mno, isAdmin,
            })
        }
        const mobileExists = await User.findOne({ mobile: req.body.mno })
        if (mobileExists) {
            return res.render("users/registration", {
                message: "This mobile number already exists. Please refill the form!", name: req.body.name, mobile: req.body.mno, isAdmin,
            })
        }

        if (isAdmin && req.body.inviteCode !== process.env.ADMIN_INVITE_CODE) {
            return res.render("users/registration", {
                message: "Invalid admin invite code", name: req.body.name, mobile: req.body.mno, isAdmin
            })
        }

        const spassword = await securepassword(req.body.password)
        if (!spassword) {
            return redirectWithToast.error(req, res, "Password encryption failed. Please try again.", "/register")
        }

        const defaultDp = isAdmin ? "/public/Images/defaultAdmin.jpg" : "/public/Images/defultProfilePic.jpg"

        const user = new User({
            name: req.body.name,
            password: spassword,
            mobile: req.body.mno,
            email: req.body.email,
            image: req?.file?.path ? req.file.path : defaultDp,
            is_admin: isAdmin ? 1 : 0,
        })

        const userData = await user.save()
        if (userData){
            if (isAdmin) {
                return redirectWithToast.success(req, res, "Your registration is successful!", "/admin")
            } else {
                return redirectWithToast.success(req, res, "Your registration is successful!", "/")
            }
        }
    }
    catch (error) {
        console.error(error)
        return redirectWithToast.error(req, res, `Internal Server error. Please try agan later`, "/")
    }
}


const loginLoad = async(req,res)=>{
    try {
        res.render("users/login", { toast: getToast(req) })
    } catch (error) {
        console.error(error)
        res.status(500).render("error/500")
    }
}


const verifyLogin = async(req,res)=>{
   
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email }).lean()
       
        if(userData){
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if(passwordMatch){
                    if (userData.is_admin) {
                        return redirectWithToast.error(req, res, "If you are an admin, click the Admin Panel below to log in.", "/")
                    }
                    req.session.user = userData._id;
                    return redirectWithToast.success(req, res, "Welcome home!", "/home")
            }
            else{
                return redirectWithToast.error(req, res, "Please check your password", "/")
            }
        }
        else{
            return redirectWithToast.error(req, res, "Please enter your valid email and password", "/")
        }
    }
    catch(error){
        console.error(error);
        return redirectWithToast.error(req, res, "Internal Server error. Please try again later.", "/")
    }
}


const loadHome = async(req,res)=>{
    try{
        const userData = await User.findById({ _id: req.session.user }).lean()
        return res.render("users/home", { user: userData, toast: getToast(req) })
    }
    catch(error){
        console.error(error);
        return redirectWithToast.error(req, res, "Internal Server error. Please try again later.", "/")
    }
}


const userLogout = async(req,res)=>{
    try{
        req.session.toast = {
            type: "success",
            message: "Logged out successfully!",
        }

        delete req.session.user
        res.redirect("/")
    }
    catch(error){
        console.error(error);
        return redirectWithToast.error(req, res, "Internal Server error. Please try again later.", "/home")
    }
}


const editLoad = async(req,res)=>{
    try{
        const userData = await User.findById({ _id: req.session.user }).lean()
        if(userData){
            res.render('users/edit',{ user: userData, toast: getToast(req) });
        }
        else{
            return redirectWithToast.error(req, res, "Error while updating profile. Please try again later.", "/home")
        }
    }
    catch(error){
        console.error(error);
        return redirectWithToast.error(req, res, "Internal Server error. Please try again later.", "/home")
    }
}


const updateProfile = async(req,res)=>{
    try{
        const id = req.body.id
        const { name, email, mno: mobile, password } = req.body

        const spassword = await securepassword(password);
        if (!spassword) {
            return redirectWithToast.error(req, res, "Password encryption failed. Please try again.", "/edit")
        }

        const user = await User.findById(id)

        if (user.email.trim() !== email.trim()) {
            const emailExists = await User.findOne({ email })
            if (emailExists) {
                return redirectWithToast.error(req, res, "Email already exists. Please use another email.", "/edit")
            }
        }

        if (user.mobile.toString().trim() !== mobile.toString().trim()) {
            const mobileExists = await User.findOne({ mobile })
            if (mobileExists) {
                return redirectWithToast.error(req, res, "Mobile number already exists. Please use another number.", "/edit")
            }
        }

        await User.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    name,
                    email,
                    mobile,
                    password: spassword,
                    image: req?.file?.path ? req.file.path : user.image,
                    is_admin: false
                },
            },
        )
        return redirectWithToast.success(req, res, "Updated your profile successfully!", "/home")
    }
    catch(error){
        console.error(error)
        return redirectWithToast.error(req, res, "Internal Server error. Please try again later.", "/edit")
    }
}


module.exports = {loadRegister, insertUser, loginLoad, verifyLogin, loadHome, userLogout, editLoad, updateProfile}; 