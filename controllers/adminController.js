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
    }
}

const loadDashboard = async(req,res)=>{
    if(req.session.admin){
        try{
            const id = req.session.admin;
            const adminData = await User.findOne({ _id: id }).lean()

            res.render("admin/home", { admin: adminData, toast: getToast(req) })
        }
        catch(error){
             console.error(error)
        }
    }
    else{
        res.redirect('/admin')
    }
    
}

const logout = async(req,res)=>{
    if(req.session.admin){
        try{
            req.session.destroy();
            res.redirect('/admin');
        }
        catch(error){
            console.error(error)
        }
    }
    else{
        res.redirect('/admin')
    }
}

const adminDashboard = async (req,res)=>{
    if(req.session.admin){        
        try{    
            const usersData = await User.find({ is_admin: 0 }).lean() 
            const adminData = await User.findOne({ is_admin: 1 }).lean()
            res.render("admin/dashboard", { users: usersData, admin: adminData, toast: getToast(req) })
        }
        catch(error){
            console.error(error);
        }
    }
    else{
        res.redirect('/admin');
    }
}

const loadEditSelf = async(req,res)=>{
    try{
        const id = req.query.id;
        const admin = await User.findOne({ _id: id }).lean()
        if(admin){
            res.render('admin/edit-self',{admin:admin});
        }
        else{
            res.redirect('/admin');
        }
    }
    catch(error){
        console.error(error);
    }
}

const editSelf = async(req,res)=>{
    try{
        const id = req.body.id;
        const password = req.body.password;
        // const image = req.file.filename;
        const spassword = await securepassword(password);
        if(req.file){
            const adminData = await User.findOneAndUpdate({_id:id},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mno, password:spassword, image:req.file.filename }})
        }
        else{
         const adminData = await User.findOneAndUpdate({_id:id},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mno, password:spassword, }})

        }

        req.session.toast = {
            type: "success",
            message: "Updated profile successfully!",
        }
        res.redirect("/admin/home")
    }
    catch(error){
        req.session.toast = {
            type: "error",
            message: error.message,
        }
        console.error(error);
    }
}

const LoadNewUser= async(req,res)=>{
    if(req.session.admin){
        try{
            const adminData = await User.findOne({ is_admin: 1 }).lean()
            res.render('admin/new-user',{admin:adminData.name});
        }
        catch(error){
            console.error(error);
        }
    }
    else{
        res.redirect('/admin')
    }
}

const addUser = async(req,res)=>{
    if(req.session.admin){
        try{
            const spassword = await securepassword(req.body.password);
            
            const user = new User({
                name:req.body.name,
                email:req.body.email,
                mobile:req.body.mno,
                image:req.file.filename,
                password:spassword,
                is_admin: false
            })
            
            const userData = await user.save();
            if(userData){
                req.session.toast = {
                    type: "success",
                    message: "Created new user successfully!",
                }
                res.redirect('/admin/dashboard')
            }
            else{
                req.session.toast = {
                    type: "error",
                    message: "Try again later!",
                }
                res.render('admin/new-user',{message: 'Something went wrong!'})
            }
        }
        catch(error){
            console.error(error);
        }
    }
    else{
        res.redirect('/admin');
    }
}

const loadEditUser = async(req,res)=>{
   if(req.session.admin){
    try{
        const id = req.query.id;
        const userData = await User.findById({ _id: id }).lean() 
        if(userData){
            res.render('admin/edit-user',{user: userData});
        }
        else{
            res.redirect('/admin/dashboard');
        }
        
    }
    catch(error){
        console.error(error);
    }
   }
   else{
    res.redirect('/admin')
   }
}

const updateUser = async(req,res)=>{
if(req.session.admin)
    try{
        const id = req.body.id;
        if(req.file)
        {
            const userData = await User.findByIdAndUpdate({_id:id},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mno, image:req.file.filename}})
        }
        else{
            const userData = await User.findByIdAndUpdate({_id:id},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mno}})
        }
        req.session.toast = {
            type: "success",
            message: "Updated the user successfully!",
        }
        res.redirect('/admin/dashboard');
    }
    catch(error){
        req.session.toast = {
            type: "error",
            message: error.message,
        }
        console.error(error);
    }
else{
    res.redirect('/admin')
}
}

const deleteUser = async(req,res)=>{
   if(req.session.admin){
    try{
        const id = req.query.id;
        const userData = await User.deleteOne({_id:id});
        req.session.toast = {
            type: "success",
            message: "Deleted the user successfully!",
        }
        res.redirect('/admin/dashboard')
    }
    catch(error){
        req.session.toast = {
            type: "error",
            message: error.message,
        }
        console.error(error);
    }
   }
   else{
    res.redirect('/admin')
   }
}

const searchUser = async(req,res)=>{
        try{
            if(req.session.admin){
                const searchData = req.body.search;
                
                const result = await User.find({
                    $and: [{ name: { $regex: searchData, $options: "i" } }, { is_admin: 0 }],
                }).lean()
        
                const admin = await User.findOne({is_admin:1});
                        
            if(result==[]){result=null;}
            res.render('admin/dashboard',{ users: result, admin: admin});
        }
        else{
            res.redirect('/admin');
        }
    }
    catch(error){
        console.error(error);
    }

    
}
module.exports = {loginLoad, verifyLogin, loadDashboard, logout, adminDashboard, loadEditSelf, editSelf,
                  LoadNewUser, addUser, loadEditUser, updateUser, deleteUser, searchUser}