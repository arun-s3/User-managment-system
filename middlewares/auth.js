
const isLogin = async (req,res,next)=>{
    try{
        if(req.session.user){}
        else{
            res.redirect('/')
        }
        next();
    }
    catch(error){
        console.error(error);
    }
}

const isLogout = async (req,res,next)=>{
    try{
        if(req.session.user){
            res.redirect('/home')
        }
        else{
            next();
        }
    }
    catch(error){
        console.error(error)
    }
}

module.exports = {isLogin, isLogout};