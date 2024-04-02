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
        const tempData = await User.findOne({email:req.body.email});
        if (tempData){
            res.render("users/registration", {message:"This email already exists. Please refill the form!", 
                                              name:req.body.name, mobile:req.body.mno})
        }
        else{
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
            res.render('users/registration',{message: "Your registration is successful!!"})
        }
        else{
            res.render('users/registration',{message: "Your registration has failed"})
        }
        }
        
    }
    catch(error){
        console.log(error.message)
    }
}

const loginLoad = async(req,res)=>{
    console.log("Just inside LoginLoad --"+ req.session.user)
    if(req.session.user){
        res.redirect('users/home')
    }
    else{
        try{
            console.log(req.session.user)
            res.render('users/login');
        }
        catch(error){
            console.log(error.message);
        }
    }
    
}

const verifyLogin = async(req,res)=>{
   
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});
       
        if(userData){
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if(passwordMatch){
               
                    req.session.user = userData._id;
                    res.redirect('/home');
                
            }
            else{
                res.render('users/login', {message: "Please check your password"})
            }
        }
        else{
            res.render('users/login', {message:"Please put your valid email and password"})
        }
    }
    catch(error){
        console.log(error.message);
    }
}

const loadHome = async(req,res)=>{
    try{
        const userData = await User.findById({_id:req.session.user});
        res.render('users/home', {user: userData});
        console.log(req.session.user)

    }
    catch(error){
        console.log(error.message);
    }
}

const userLogout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect("/");
    }
    catch(error){
        console.log(error.message);
    }
}

const editLoad = async(req,res)=>{
    try{
        const id = req.query.id;
        const userData = await User.findById({_id:id});
        if(userData){
            res.render('users/edit',{user:userData});
        }
        else{
            res.redirect('/home');
        }
    }
    catch(error){
        console.log(error.message);
    }
}

const updateProfile = async(req,res)=>{
    try{

        const spassword = await securepassword(req.body.password);
        if(req.file){
            const userData = await User.findByIdAndUpdate({ _id:req.body.id},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mno, password:spassword, image:req.file.filename}});
        }
        else{
            const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mno, password:spassword}});
        }
        res.redirect('/home')
    }
    catch(error){
        console.log(error.message);
    }
}

module.exports = {loadRegister, insertUser, loginLoad, verifyLogin, loadHome, userLogout, editLoad, updateProfile}; 