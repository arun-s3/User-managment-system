const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "Cortex",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
        transformation: [
            {
                width: 400,
                height: 400,
                crop: "fill",
                gravity: "face",
                quality: "auto",
                fetch_format: "auto",
            },
        ],
        public_id: () => `cortexUser_${Date.now()}`
    },
})


module.exports = { cloudinary, storage }
