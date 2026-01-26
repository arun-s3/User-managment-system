const upload = require("../config/multer")

const imageUploader = (redirectTo) => {
    return (req, res, next) => {
        
        upload.single("image")(req, res, function (err) {
            if (err) {
                console.error("MULTER ERROR:", err)

                let msg = null

                if (err.code === "LIMIT_FILE_SIZE") {
                    msg = "Image size must be less than 5MB! Add a new image and try again"
                } else {
                    msg = `${err.message} Hence image upload failed. Please try again!`
                }

                req.session.toast = {
                    type: "error",
                    message: msg,
                }

                const redirectPath = typeof redirectTo === "function" ? redirectTo(req) : redirectTo

                return res.redirect(redirectPath)
            }
            next()
        })
    }
}

module.exports = { imageUploader }
