
const isLogin = async(req,res,next)=>{
    try{
        if(req.session.admin && !req.session.user){
            next()
        }
        else if(req.session.user){
            res.redirect("/")
        }else{
            res.redirect("/admin")
        }
    }
    catch(error){
        console.log(error.message)
    
    }
}

const isLogout = async(req,res,next)=>{
    try{
        if(req.session.admin){
            res.redirect('/admin/home')
        }
        if(req.session.user){
            res.redirect("/")
        }
        next();
    }
    catch(error){
        console.log(error.message)
    }
}

module.exports = {isLogin, isLogout}