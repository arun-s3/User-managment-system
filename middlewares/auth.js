
const isLogin = async (req,res,next)=>{
    try{
        if (req.session.user && !req.session.admin) {
            next()
        }else if(req.session.admin){
            res.redirect("/admin")
        } else {
            res.redirect("/")
        }
    }
    catch(error){
        console.error(error);
    }
}

const isLogout = async (req,res,next)=>{
    try{
        if (req.session.user && !req.session.admin) {
            res.redirect("/home")
        } else if (req.session.admin) {
            res.redirect("/admin")
        } else {
            next()
        }
    }
    catch(error){
        console.error(error)
    }
}

module.exports = {isLogin, isLogout};