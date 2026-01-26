
module.exports = {
    success: (req, res, msg, path) => {
        req.session.toast = {
            type: "success",
            message: msg,
        }
        return res.redirect(path)
    },
    error: (req, res, msg, path) => {
        req.session.toast = {
            type: "error",
            message: msg,
        }
        return res.redirect(path)
    },
    info: (req, res, msg, path) => {
        req.session.toast = {
            type: "info",
            message: msg,
        }
        return res.redirect(path)
    },
}
