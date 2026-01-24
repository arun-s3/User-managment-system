const User = require("../models/userModel")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const getToast = require("../Utils/getToast")


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
        req.session.toast = {
            type: "error",
            message: "Internal Server error. Please try again later.",
        }
        return res.redirect("/")
    }
}


const insertUser = async (req, res) => {
    try {
        const isAdmin = req.query.admin === "true"

        const tempData = await User.findOne({ email: req.body.email })
        if (tempData) {
            return res.render("users/registration", {
                message: "This email already exists. Please refill the form!", name: req.body.name, mobile: req.body.mno, isAdmin,
            })
        }

        if (isAdmin && req.body.inviteCode !== process.env.ADMIN_INVITE_CODE) {
            return res.render("users/registration", {
                message: "Invalid admin invite code", name: req.body.name, mobile: req.body.mno, isAdmin
            })
        }

        const spassword = await securepassword(req.body.password)

        const user = new User({
            name: req.body.name,
            password: spassword,
            mobile: req.body.mno,
            email: req.body.email,
            image: req.file.path,
            is_admin: isAdmin ? 1 : 0,
        })

        const userData = await user.save()
        if (userData){
            req.session.toast = {
                type: "success",
                message: "Your registration is successful!",
            }
            if (isAdmin) {
                return res.redirect("/admin")
            } else return res.redirect("/")
        }
    }
    catch (error) {
        console.error(error)
        req.session.toast = {
            type: "error",
            message: `Internal Server error. ${error.message}`,
        }
        return res.redirect("/")
    }
}


const loginLoad = async(req,res)=>{
    if(req.session.user){
        res.redirect('users/home')
    }
    else{
        try{
            res.render("users/login", { toast: getToast(req) })
        }
        catch(error){
            console.error(error);
        }
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
                    req.session.user = userData._id;
                    return res.redirect("/home")
            }
            else{
                return res.render("users/login", { message: "Please check your password" })
            }
        }
        else{
            return res.render("users/login", { message: "Please put your valid email and password" })
        }
    }
    catch(error){
        console.error(error);
        req.session.toast = {
            type: "error",
            message: "Internal Server error. Please try again later.",
        }
        return res.redirect("/")
    }
}


const loadHome = async(req,res)=>{
    try{
        const userData = await User.findById({ _id: req.session.user }).lean()
        res.render("users/home", { user: userData, toast: getToast(req) })
    }
    catch(error){
        console.error(error);
        req.session.toast = {
            type: "error",
            message: "Internal Server error. Please try again later.",
        }
        return res.redirect("/")
    }
}


const userLogout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect("/");
    }
    catch(error){
        console.error(error);
        req.session.toast = {
            type: "error",
            message: error.message,
        }
        return res.redirect("/home")
    }
}


const editLoad = async(req,res)=>{
    try{
        const id = req.query.id;
        const userData = await User.findById({ _id: id }).lean()
        if(userData){
            res.render('users/edit',{user:userData});
        }
        else{
            req.session.toast = {
                type: "error",
                message: "Error while updating profile. Please try again later.",
            }
            return res.redirect("/home")
        }
    }
    catch(error){
        console.error(error);
        req.session.toast = {
            type: "error",
            message: "Internal Server error. Please try again later.",
        }
        return res.redirect("/home")
    }
}


const updateProfile = async(req,res)=>{
    try{

        const spassword = await securepassword(req.body.password);
        if(req.file){
            await User.findByIdAndUpdate(
                { _id: req.body.id },
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        mobile: req.body.mno,
                        password: spassword,
                        image: req.file.path,
                    },
                },
            )
        }
        else{
            await User.findByIdAndUpdate(
                { _id: req.body.id },
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        mobile: req.body.mno,
                        password: spassword,
                    },
                },
            )
        }
        req.session.toast = {
            type: "success",
            message: "Updated your profile successfully!",
        }
        return res.redirect("/home")
    }
    catch(error){
        console.error(error)
        req.session.toast = {
            type: "error",
            message: error.message,
        }
        return res.redirect("/home")
    }
}


module.exports = {loadRegister, insertUser, loginLoad, verifyLogin, loadHome, userLogout, editLoad, updateProfile}; 