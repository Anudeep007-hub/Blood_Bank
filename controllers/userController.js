const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const randomstring = require("randomstring");

const securePassword = async(password)=>{
    try {
       const passwordHash = await bcrypt.hash(password,10);
       return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}


//reset password mail
const  sendResetPasswordMail = async(name,email,token)=>{
    try {
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        })

        const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:'For password reset',
            html:`<p>Hi ${name}</p> , please <a href="http://127.0.0.1:3000/forget-password?token=${token}">click here</a> to continue password reset`
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error.message);
            }
            else{
                console.log("Emial has been sent",info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

//for send mail
const  sendVerifyMail = async(name,email,user_id)=>{
    try {
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        })

        const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:'Email verification',
            html:`<p>Hi ${name}</p> , please <a href="http://127.0.0.1:3000/verify?id=${user_id}">click here</a> to verify`
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error.message);
            }
            else{
                console.log("Emial has been sent",info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}
const loadRegister = async(req,res)=>{
    try{
        res.render('registration');
    }catch(error){
        console.log(error.message);
    }
}

const insertUser = async(req,res)=>{
    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mno,
            image:req.file.filename,
            password:spassword,
            is_admin:0 
        });
        const userData = await user.save();
        if(userData){
            sendVerifyMail(req.body.name,req.body.email,userData._id);
            res.render('registration',{message:"your registration has been successfull.please verify your mail."});
        }
        else{
            res.render('registration',{message:"your registration has been failed"});
        }
    } catch (error) {
        console.log(error.message)
    }
}

const verifyMail = async(req,res)=>{
    try {
      const updateInfo = await User.updateOne({_id:req.query.id},{$set:{is_varified:1}});
      console.log(updateInfo);
      res.render("email-verified");
    } catch (error) {
        console.log(error.message);
    }
}

//login user methods started

const loginLoad = async(req,res)=>{
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message)
    }
}

const verifyLogin = async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
       const userData = await User.findOne({email:email});
       if(userData){
        const passwordMatch = await bcrypt.compare(password,userData.password);
        if(passwordMatch){
            if(userData.is_varified === 0){
                res.render('login',{message:"please verify your mail"});
            }else{
                req.session.user_id = userData._id;
                res.redirect('/home');
            }
        }
        else{
            res.render('login',{message:"Email and password incorrect"});
        }
       }
    } catch (error) {
        console.log(error.message);
    }
}

const loadHome = async(req,res)=>{
    try{
        const userData = await User.findById({_id:req.session.user_id});
        res.render('home',{user:userData});
    }catch(error){
        console.log(error.message);
    }
}

const userLogout = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}

//forget password code start
const forgetLoad = async(req,res)=>{
    try {
        res.render('forget');
    } catch (error) {
        console.log(message);
    }
}

const forgetVerify = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({ email: email }); 
        if (userData) {
            if (userData.is_varified === 0) {
                res.render('forget', { message: "Email not verified!" });
            } else {
                const randomString = randomstring.generate();
                await User.updateOne({ email: email }, { $set: { token: randomString } });
                sendResetPasswordMail(userData.name, userData.email, randomString);
                res.render('forget', { message: "Please check your mail to reset your password" });
            }
        } else {
            res.render('forget', { message: "User email is incorrect" });
        }
    } catch (error) {
        console.log(error.message);
    }
}

const resetPassword = async(req,res)=>{
    try {
        const passwordHash = req.body.password;
        const user_id = req.body.user_id;

        const secure_password = await securePassword(passwordHash);
        const updatedData = await User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_password,token:''}});
        res.redirect("/");
    } catch (error) {
        console.log(error.message);
    }
}

const forgetPasswordLoad = async(req,res)=>{
     try {
        const token = req.query.token;
        // const email = req.body.email;
        const tokenData = await User.findOne({token:token});
        if(tokenData){
            if(tokenData.token === token){
            res.render('forget-password',{user_id:tokenData._id});
            }
            else{
                res.render('404',{message:"Token in invalid"});
            }
        }else{
            res.render('404',{message:"Token in invalid"});
        }
     } catch (error) {
        console.log(error.message);
     }
}

//for verification send mail link
const verificationLoad = async(req,res)=>{
    try {
        res.render('verification');
    } catch (error) {
        console.log(error.message);
    }
}

const sendVerificationLink = async(req,res)=>{
    try {
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if(userData){
            sendVerifyMail(userData.name,userData.email,userData._id); 
            res.render('verification',{message:"Reset verification mail sent your mail id,please check"}); 
        }
        else{
            res.render("verification",{message:"This email doesnt exist"});
        }
    } catch (error) {
        console.log(error.message);
    }
}

//user profile edit and update

const editLoad = async(req,res)=>{
    try {
        const id = req.query.id;
        const userData = await User.findById({_id:id});
        if(userData){
            res.render('edit',{user:userData});
        }
        else{
            res.redirect('/home');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const updateProfile = async(req,res)=>{
    try {
        if(req.file){
            const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name , email:req.body.email, mobile:req.body.mno,image:req.file.filename}});
        }
        else{
            const userData1 = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name , email:req.body.email, mobile:req.body.mno}});
        }
        res.redirect('/home');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    verificationLoad,
    sendVerificationLink,
    editLoad,
    updateProfile
}

