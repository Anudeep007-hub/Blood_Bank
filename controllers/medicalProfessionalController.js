const MedicalProfessional = require('../models/medicalProfessionalModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const randomstring = require("randomstring");
const {DonorModel} = require('../models/donorModel');
const History = require('../models/mphistorymodel');

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
            html:`<p>Hi ${name}</p> , please <a href="http://127.0.0.1:3000/medicalprofessional/forget-password?token=${token}">click here</a> to continue password reset`
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error.message);
            }
            else{
                console.log("Email has been sent",info.response);
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
            html:`<p>Hi ${name}</p> , please <a href="http://127.0.0.1:3000/medicalprofessional/verify?id=${user_id}">click here</a> to verify`
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error.message);
            }
            else{
                console.log("Email has been sent",info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}


const verifyMail = async(req,res)=>{
    try {
      const updateInfo = await MedicalProfessional.updateOne({_id:req.query.id},{$set:{is_varified:1}});
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
       const medicalProfessionalData = await MedicalProfessional.findOne({email:email});
       if(medicalProfessionalData){
        const passwordMatch = await bcrypt.compare(password,medicalProfessionalData.password);
        if(passwordMatch){
            if(medicalProfessionalData.is_varified === 0){
                res.render('login',{message:"Please verify your email"});
            }else{
                req.session.medicalProfessional_id = medicalProfessionalData._id;
                res.redirect('/medicalProfessional/home');
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
        const medicalProfessionalData = await MedicalProfessional.findOne({ email: email }); 
        if (medicalProfessionalData) {
            if (medicalProfessionalData.is_varified === 0) {
                res.render('forget', { message: "Email not verified!" });
            } else {
                const randomString = randomstring.generate();
                await MedicalProfessional.updateOne({ email: email }, { $set: { token: randomString } });
                sendResetPasswordMail(medicalProfessionalData.name, medicalProfessionalData.email, randomString);
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
        const medicalProfessional_id = req.body.medicalProfessional_id;

        const secure_password = await securePassword(passwordHash);
        const updatedData = await MedicalProfessional.findByIdAndUpdate({_id: medicalProfessional_id}, {$set:{password:secure_password,token:''}});
        res.redirect("/medicalprofessional/home");
    } catch (error) {
        console.log(error.message);
    }
}

const forgetPasswordLoad = async(req,res)=>{
     try {
        const token = req.query.token;
        const tokenData = await MedicalProfessional.findOne({token:token});
        if(tokenData){
            if(tokenData.token === token){
            res.render('forget-password',{medicalProfessional_id:tokenData._id});
            }
            else{
                res.render('404',{message:"Token is invalid"});
            }
        }else{
            res.render('404',{message:"Token is invalid"});
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
        const medicalProfessionalData = await MedicalProfessional.findOne({email:email});
        if(medicalProfessionalData){
            sendVerifyMail(medicalProfessionalData.name, medicalProfessionalData.email, medicalProfessionalData._id); 
            res.render('verification',{message:"Reset verification mail sent your mail id,please check"}); 
        }
        else{
            res.render("verification",{message:"This email doesn't exist"});
        }
    } catch (error) {
        console.log(error.message);
    }
}

//user profile edit and update

const editLoad = async(req,res)=>{
    try {
        const id = req.query.id;
        const medicalProfessionalData = await MedicalProfessional.findById({_id:id});
        if(medicalProfessionalData){
            res.render('edit',{user:medicalProfessionalData});
        }
        else{
            res.redirect('/medicalProfessional/home');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const updateProfile = async(req,res)=>{
    try {
        if(req.file){
            const medicalProfessionalData = await MedicalProfessional.findByIdAndUpdate({_id:req.body.medicalProfessional_id},{$set:{name:req.body.name , email:req.body.email, mobile:req.body.mno,image:req.file.filename}});
        }
        else{
            const medicalProfessionalData1 = await MedicalProfessional.findByIdAndUpdate({_id:req.body.medicalProfessional_id},{$set:{name:req.body.name , email:req.body.email, mobile:req.body.mno}});
        }
        res.redirect('/medicalProfessional/home');
    } catch (error) {
        console.log(error.message);
    }
}
const unverified = async (req, res) => {
    try {
        const donorData = await DonorModel.find();
        res.render('unverified', {
            donors: donorData
        });
    } catch (error) {
        console.log(error.message);
        // Handle the error appropriately, perhaps sending an error response
        res.status(500).send("Error fetching data from database");
    }
}



const loadHome = async (req, res) => {
    try {
        const medicalProfessionalData = await MedicalProfessional.findById(req.session.medicalProfessional_id);
        const history = await History.find().sort({ time: -1 }).limit(10); // Fetch latest 10 history entries
        res.render('home', { user: medicalProfessionalData, history: history });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error loading home page");
    }
}

const showHistory = async (req, res) => {
    try {
        const history = await History.find().sort({ time: -1 });
        res.render('history', { history: history });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    // loadRegister,
    // insertMedicalProfessional,
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
    updateProfile,
    unverified,
    showHistory
}