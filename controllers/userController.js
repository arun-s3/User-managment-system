const User = require("../models/userModel")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const securepassword = async(password)=>{
    try{
        return await bcrypt.hash(password,10);
    }
    catch(err){
        console.log(err.message);
    }
}

const loadRegister = async (req,res)=>{
    try{
        res.render('users/registration');
    }
    catch(error)
    {
        console.log(error.message);
    }
}

const insertUser = async(req,res)=>{
    try{
        const spassword = await securepassword(req.body.password);
        const user = new User({
            name:req.body.name,
            password:spassword,
            mobile:req.body.mno,
            email:req.body.email,
            image:req.file.filename,
            is_admin:0
        });
        const userData = await user.save();
        if(userData){
            res.render('users/registration',{message: "Your registration is successful.Please verify your mail"})
        }
        else{
            res.render('users/registration',{message: "Your registration has failed"})
        }
    }
    catch(error){
        console.log(error.message)
    }
}

const loginLoad = async(req,res)=>{
    try{
        res.render('users/login');
    }
    catch(error){
        console.log(error.message);
    }
}

const verifyLogin = async(reg,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userData = User.findOne({email:email});
        if(userData){
            const passwordMatch = bcrypt.compare(password, userData.password);
            if(passwordMatch){
                if(userData.is_verified == 0){
                    res.render('users/login',{message: "Please verify your mail"});
                }
                else{
                    res.redirect('/home');
                }
            }
            else{
                res.render('users/login', {message:"Please check your password"})
            }
        }
        else{
            res.render('users/login', {message:"Please put your valid email and paswsord"})
        }
    }
    catch(error){
        console.log(error.message);
    }
}

const loadHome = async(req,res)=>{
    try{
        res.render('/home');
    }
    catch(error){
        console.log(error.message);
    }
}
module.exports = {loadRegister, insertUser, loginLoad, verifyLogin, loadHome}; 