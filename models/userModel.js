const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default: "/public/Images/defultProfilePic.jpg",
    },
    is_admin: {
        type: Boolean,
        required: true,
    },
})

module.exports = new mongoose.model("userModel",userSchema);