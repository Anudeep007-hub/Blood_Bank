const Employee = require('../models/Employeedetailsmodel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const randomstring = require("randomstring");
const { DonorModel } = require('../models/donorModel');

const securePassword = async(password)=>{
    try {
       const passwordHash = await bcrypt.hash(password,10);
       return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}


// reset password mail
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
            html:`<p>Hi ${name}</p> , please <a href="http://127.0.0.1:3000/employee/forget-password?token=${token}">click here</a> to continue password reset`
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
            html:`<p>Hi ${name}</p> , please <a href="http://127.0.0.1:3000/employee/verify?id=${user_id}">click here</a> to verify`
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


const verifyMail = async(req,res)=>{
    try {
      const updateInfo = await Employee.updateOne({_id:req.query.id},{$set:{is_varified:1}});
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
       const employeeData = await Employee.findOne({email:email});
       if(employeeData){
        const passwordMatch = await bcrypt.compare(password,employeeData.password);
        if(passwordMatch){
            if(employeeData.is_varified === 0){
                res.render('login',{message:"please verify your mail"});
            }else{
                req.session.employee_id = employeeData._id;
                res.redirect('/employee/home');
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
        const employeeData = await Employee.findById({_id:req.session.employee_id});
        res.render('home',{user:employeeData});
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
        const employeeData = await Employee.findOne({ email: email }); 
        if (employeeData) {
            if (employeeData.is_varified === 0) {
                res.render('forget', { message: "Email not verified!" });
            } else {
                const randomString = randomstring.generate();
                await Employee.updateOne({ email: email }, { $set: { token: randomString } });
                sendResetPasswordMail(employeeData.name, employeeData.email, randomString);
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
        const employee_id = req.body.employee_id;

        const secure_password = await securePassword(passwordHash);
        const updatedData = await Employee.findByIdAndUpdate({_id:employee_id},{$set:{password:secure_password,token:''}});
        res.redirect("/employee/home");
    } catch (error) {
        console.log(error.message);
    }
}
const forgetPasswordLoad = async(req,res)=>{
     try {
        const token = req.query.token;
        // const email = req.body.email;
        const tokenData = await Employee.findOne({token:token});
        if(tokenData){
            if(tokenData.token === token){
            res.render('forget-password',{employee_id:tokenData._id});
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
        const employeeData = await Employee.findOne({email:email});
        if(employeeData){
            sendVerifyMail(employeeData.name,employeeData.email,employeeData._id); 
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
        const employeeData = await Employee.findById({_id:id});
        if(employeeData){
            res.render('edit',{user:employeeData});
        }
        else{
            res.redirect('/employee/home');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const updateProfile = async(req,res)=>{
    try {
        if(req.file){
            const employeeData = await Employee.findByIdAndUpdate({_id:req.body.employee_id},{$set:{name:req.body.name , email:req.body.email, mobile:req.body.mno,image:req.file.filename}});
        }
        else{
            const employeeData1 = await Employee.findByIdAndUpdate({_id:req.body.employee_id},{$set:{name:req.body.name , email:req.body.email, mobile:req.body.mno}});
        }
        res.redirect('/employee/home');
    } catch (error) {
        console.log(error.message);
    }
}


const updateDoctorName = async (req, res) => {
    try {
        const donorName = req.body.donorName;
        const doctorName = req.body.doctorName;

        // Find the donor in the database by name
        const donor = await DonorModel.findOne({ name: donorName });

        if (!donor) {
            return res.status(404).send('Donor not found');
        }

        // Update the doctor's name for the donor
        donor.doctor = doctorName;

        // Save the updated donor back to the database
        await donor.save();

        // Send success response
        res.send(`Doctor's name updated successfully for ${donorName}`);
    } catch (error) {
        console.error('Error updating doctor name:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
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
    updateDoctorName
}
