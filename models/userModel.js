const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    is_admin:{
        type:Boolean,
        required:true
    },
    is_verified:{
        type:Boolean,
        default:0
    }
});

module.exports = new mongoose.model("userModel",userSchema);