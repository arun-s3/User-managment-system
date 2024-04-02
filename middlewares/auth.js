
const isLogin = async (req,res,next)=>{
    try{
        if(req.session.user){}
        else{
            res.redirect('/')
        }
        next();
    }
    catch(error){
        console.log(error.message);
    }
}

const isLogout = async (req,res,next)=>{
    try{
        if(req.session.user){
            console.log("inside isLogout-if")
            res.redirect('/home')
        }
        else{
            console.log("inside isLogout-else")
            next();
        }
    }
    catch(error){
        console.log(error.message)
    }
}

module.exports = {isLogin, isLogout};