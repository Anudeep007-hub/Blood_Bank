const isLogin = async(req,res,next)=>{
    try {
        if(req.session.medicalProfessional_id){
        next();
        }else{
            res.redirect('/medicalProfessional/login');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async(req,res,next)=>{
    try {
        if(req.session.medicalProfessional_id){
            res.redirect('/medicalProfessional/home');
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