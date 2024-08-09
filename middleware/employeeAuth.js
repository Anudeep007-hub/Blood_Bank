const isLogin = async(req,res,next)=>{
    try {
        if(req.session.employee_id){
        next();
        }else{
            res.redirect('/employee/login');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async(req,res,next)=>{
    try {
        if(req.session.employee_id){
            res.redirect('/employee/home');
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