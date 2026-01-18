
module.exports = function getToast(req) {
    const toast = req.session.toast
    delete req.session.toast 
    return toast
}
