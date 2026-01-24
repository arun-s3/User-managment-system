const User = require('../models/userModel')
const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const randomstring = require('randomstring')
const getToast = require('../Utils/getToast')

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
                    res.redirect("/admin/home");
                }
                else{ 
                    res.render('admin/login',{message: "Please verify your password"})
                }
            }
            else{
                res.render('admin/login',{message: "Please verify your email id and password"})
            }
        }
        else{ 
            res.render('admin/login',{message: "Please put a valid email address"})
        }
    }
    catch(error){
        console.error(error)
        req.session.toast = {
            type: "error",
            message: "Internal Server error. Please try again later.",
        }
        return res.redirect("/admin/")
    }
}


const loadDashboard = async(req,res)=>{
    try{
        const id = req.session.admin;
        const adminData = await User.findOne({ _id: id }).lean()

        res.render("admin/home", { admin: adminData, toast: getToast(req) })
    }
    catch(error){
        console.error(error)
        req.session.toast = {
            type: "error",
            message: `Internal server error--${error.message}`,
        }
        return res.redirect("/admin")
    }
}


const logout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/admin');
    }
    catch(error){
        console.error(error)
        req.session.toast = {
            type: "error",
            message: `Internal server error--${error.message}`,
        }
        return res.redirect("/admin/home")
    }
}


const adminDashboard = async (req,res)=>{
    try{    
        const usersData = await User.find({ is_admin: 0 }).lean() 
        const adminData = await User.findOne({ is_admin: 1 }).lean()
        res.render("admin/dashboard", { users: usersData, admin: adminData, toast: getToast(req) })
    }
    catch(error){
        console.error(error)
        req.session.toast = {
            type: "error",
            message: `Internal server error--${error.message}`,
        }
        return res.redirect("/admin/home")
    }
}


const loadEditSelf = async(req,res)=>{
    try{
        const id = req.query.id;
        const admin = await User.findOne({ _id: id }).lean()
        if(admin){
            res.render('admin/edit-self',{admin:admin});
        }
    }
    catch(error){
        console.error(error)
        req.session.toast = {
            type: "error",
            message: `Internal server error--${error.message}`,
        }
        return res.redirect("/admin/home")
    }
}


const editSelf = async(req,res)=>{
    try{
        const id = req.body.id;
        const password = req.body.password;
        const spassword = await securepassword(password);
        if(req.file){
            await User.findOneAndUpdate(
                { _id: id },
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
            await User.findOneAndUpdate(
                { _id: id },
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
            message: "Updated profile successfully!",
        }
        return res.redirect("/admin/home")
    }
    catch(error){
        console.error(error)
        req.session.toast = {
            type: "error",
            message: error.message,
        }
        return res.redirect("/admin/home")
    }
}


const LoadNewUser= async(req,res)=>{
    try{
        const adminData = await User.findOne({ is_admin: 1 }).lean()
        res.render('admin/new-user',{admin:adminData.name});
    }
    catch(error){
        console.error(error);
        req.session.toast = {
            type: "error",
            message: `Internal server error--${error.message}`,
        }
        return res.redirect("/admin/dashboard")
    }
}


const addUser = async(req,res)=>{
    try{
        const spassword = await securepassword(req.body.password);
        
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mno,
            image:req.file.path,
            password:spassword,
            is_admin: false
        })
        
        const userData = await user.save();
        if(userData){
            req.session.toast = {
                type: "success",
                message: "Created new user successfully!",
            }
            return res.redirect("/admin/dashboard")
        }
        else{
            req.session.toast = {
                type: "error",
                message: "Try again later!",
            }
            return res.render("admin/new-user", { message: "Something went wrong!" })
        }
    }
    catch(error){
        console.error(error);
        req.session.toast = {
            type: "error",
            message: `Internal server error--${error.message}`,
        }
        return res.redirect("/admin/dashboard")
    }
}


const loadEditUser = async(req,res)=>{
    try{
        const id = req.query.id;
        const userData = await User.findById({ _id: id }).lean() 
        if(userData){
            res.render('admin/edit-user',{user: userData});
        }
        else{
            req.session.toast = {
                type: "error",
                message: `User not available`,
            }
            return res.redirect("/admin/dashboard")
        }
        
    }
    catch(error){
        console.error(error);
        req.session.toast = {
            type: "error",
            message: `Internal server error--${error.message}`,
        }
        return res.redirect("/admin/dashboard")
    }
}


const updateUser = async(req,res)=>{
    try{
        const id = req.body.id;
        if(req.file)
        {
            await User.findByIdAndUpdate(
                { _id: id },
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        mobile: req.body.mno,
                        image: req.file.path,
                    },
                },
            )
        }
        else{
            await User.findByIdAndUpdate(
                { _id: id },
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        mobile: req.body.mno,
                    },
                },
            )
        }
        req.session.toast = {
            type: "success",
            message: "Updated the user successfully!",
        }
        return res.redirect("/admin/dashboard")
    }
    catch(error){
        console.error(error)
        req.session.toast = {
            type: "error",
            message: `Internal server error--${error.message}`,
        }
        return res.redirect("/admin/dashboard")
    }
}


const deleteUser = async(req,res)=>{
    try{
        const id = req.query.id;
        await User.deleteOne({_id:id});
        req.session.toast = {
            type: "success",
            message: "Deleted the user successfully!",
        }
        return res.redirect("/admin/dashboard")
    }
    catch(error){
        console.error(error);
        req.session.toast = {
            type: "error",
            message: `Internal server error--${error.message}`,
        }
        return res.redirect("/admin/dashboard")
    }
}


const searchUser = async(req,res)=>{
    try{
        const searchData = req.body.search;
        
        const result = await User.find({
            $and: [{ name: { $regex: searchData, $options: "i" } }, { is_admin: 0 }],
        }).lean()

        const admin = await User.findOne({is_admin:1});
                    
        if(result==[]){result=null;}
        console.log("result---->", result)
        res.render("admin/dashboard", { users: result, admin: admin, toast: getToast(req) })
    }
    catch(error){
        console.error(error);
        req.session.toast = {
            type: "error",
            message: `Internal server error--${error.message}`,
        }
        return res.redirect("/admin/dashboard")
    }
}


module.exports = {loginLoad, verifyLogin, loadDashboard, logout, adminDashboard, loadEditSelf, editSelf,
                  LoadNewUser, addUser, loadEditUser, updateUser, deleteUser, searchUser}