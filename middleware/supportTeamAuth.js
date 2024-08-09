const isLogin = async(req,res,next)=>{
    try {
        if(req.session.supportTeam_id){
        next();
        }else{
            res.redirect('/support-team/login');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async(req,res,next)=>{
    try {
        if(req.session.supportTeam_id){
            res.redirect('/support-team/home');
        }else
        next(); 
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isLogin,
    isLogout
}