const User = require("../models/userModel");
const EmployeeModel = require("../models/Employeedetailsmodel");
const EmployeeLogin = require("../models/Employeeloginmodel");
const bloodreserves = require("../models/bloodReservesModel");
const MedicalProfessional = require("../models/medicalProfessionalModel");
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const config = require('../config/config');
const nodemailer = require("nodemailer");
const {DonorModel} =  require('../models/donorModel');
const SupportTeam = require('../models/supportTeamModel');

const SupportTeamModel = SupportTeam.ST;
//for send mail
//for send mail
const  addUserMail = async(name,email,password,user_id)=>{
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
            subject:'Admin added you Email verification',
            html:`<p>Hi ${name}</p> , please <a href="http://127.0.0.1:3000/verify?id=${user_id}">click here</a> to verify<br> <b> Email:</b>${email}<br><b>Password</b>${password}`
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

const securePassword = async(password) => {
    try {
        if (!password) {
            throw new Error('Password is required');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
        return null; // Return null to indicate an error in password hashing
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
            html:`<p>Hi ${name}</p> , please <a href="http://127.0.0.1:3000/admin/forget-password?token=${token}">click here</a> to continue password reset`
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
 


const loadLogin = async(req,res)=>{
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
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

                if(userData.is_admin === 0){
                    res.render('login',{message:"Email and password is incorrect"});
                    res.redirect("/admin/home");
                }else{
                    req.session.admin_id = userData._id;
                    res.redirect('/admin/home');
                }
                
            }else{
                res.render('login',{message:"Email and password is incorrect"});
            }
        }
        else{
            res.render('login',{message:"Email and password is incorrect"});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadDashboard = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.admin_id});
        res.render('home',{admin:userData});
    } catch (error) {
        console.log(error.message);
    }
}

const logout = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/admin');
    } catch (error) {
        console.log(error.message);
    }    
}

const forgetLoad = async(req,res)=>{
    try {
        res.render('forget');
    } catch (error) {
        console.log(error.message);
    }
}

const forgetVerify = async(req,res)=>{
    try {
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if(userData){
            if(userData.is_admin === 0){
                res.render('forget',{message:"Email is incorrect"});
            }else{
                const randomString = randomstring.generate();
                const updatedData = await User.updateOne({email:email} , {$set:{token:randomString}});
                sendResetPasswordMail(userData.name,userData.email,randomString);
                res.render('forget',{message:"Please check your mail to reset your password."});
            }
        }else{
            res.render('forget',{message:"Email is incorrect"});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const forgetPasswordLoad = async(req,res)=>{
    try {
        const token = req.query.token;
        const tokenData = await User.findOne({token:token});
        if(tokenData){
            res.render('forget-password',{admin_id:tokenData._id});
        }else{
            res.render('404',{message:"Invalid Link"});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const resetPassword = async(req,res)=>{
    try {
        const password = req.body.password;
        const admin_id = req.body.admin_id;

        const securePass = await securePassword(password);
        const updatedData = await User.findByIdAndUpdate({_id:admin_id},{$set:{password:securePass,token:''}});
        res.redirect('/admin/home');
    } catch (error) {
        console.log(error.message);
    }
}

const adminDashboard = async(req,res)=>{
    try {
        var search = '';
        if(req.query.search){
            search = req.query.search;
        }
        var page = req.query.page || '1'; // Change here

        const limit = 5;

        const usersData = await User.find({
            is_admin:0,
            $or:[
                {name:{$regex:'.*'+search+'.*',$options:'i'}},
                {email:{$regex:'.*'+search+'.*'}},
                {mobile:{$regex:'.*'+search+'.*'}}
            ]
        }).limit(limit * 1)
        .skip((page - 1) * limit) // Change here
        .exec();

        const count = await User.find({
            is_admin:0,
            $or:[
                {name:{$regex:'.*'+search+'.*',$options:'i'}},
                {email:{$regex:'.*'+search+'.*'}},
                {mobile:{$regex:'.*'+search+'.*'}}
            ]
        }).countDocuments();
    
        res.render('dashboard',{
            users:usersData,
            totalPages:Math.ceil(count/limit),
            currentPage:page,
            previous:page > 1 ? parseInt(page) - 1 : null, // Change here
            next:parseInt(page) + 1 <= Math.ceil(count/limit) ? parseInt(page) + 1 : null // Change here
        });
    } catch (error) {
        console.log(error.message);
    }
}

//Add new Work start 

const newUserLoad = async(req,res)=>{
    try {
        res.render('new-user');
    } catch (error) {
        console.log(error.message);
    }
}

const addUser = async(req,res)=>{
    try {
        const name = req.body.name;
        const email = req.body.email;
        const mno = req.body.mno;
        const image = req.file.filename;
        const password = randomstring.generate();

        const spassword = await securePassword(password);

        if (spassword === null) {
            throw new Error('Failed to hash the password');
        }

        const user = new User({
            name: name,
            email: email,
            mobile: mno,
            image: image,
            password: spassword,
            is_admin: 0
        });

        const userData = await user.save();

        if (userData) {
            addUserMail(name, email, password, userData._id);
            res.redirect('/admin/dashboard');
        } else {
            res.render('new-user', { message: 'Something wrong..' });
        }
    } catch (error) {
        console.log(error.message);
    }
}

//edit user functionality

const editUserLoad = async(req,res)=>{
    try {
        const id = req.query.id;
        const userData = await User.findById({_id:id});
        if(userData){
            res.render('edit-user',{user:userData});
        }
        else{
            res.redirect('/admin/dashboard');
        }
       
    } catch (error) {
        console.log(error.message);
    }
}

const updateUsers = async(req,res)=>{
    try {
        const userData= await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno,isvarified:req.body.verify}});
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
}

//delete users

const deleteUser =  async(req,res)=>{
    try {
        const id = req.query.id;
        await User.deleteOne({_id:id});
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
}

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

const addEmployeeMail = async (username,name, email, password, user_id) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });

        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'Admin added you - Email verification',
            html: `<p>Hi ${name},</p><p>Please <a href="http://127.0.0.1:3000/employee/verify?id=${user_id}">click here</a> to verify your email.</p><p><b>Username:</b>${username}</p><p><b>Email:</b> ${email}</p><p><b>Password:</b> ${password}</p>`
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('Email has been sent:', info.response);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
};

const EmployeeadminDashboard = async (req, res) => {
    try {
        const search = req.query.search || '';
        const page = req.query.page || '1';
        const limit = 5;

        const EmployeeData = await EmployeeModel.find({
            $or: [
                { name: { $regex: `.*${search}.*`, $options: 'i' } },
                { email: { $regex: `.*${search}.*` } },
                { mobile: { $regex: `.*${search}.*` } }
            ]
        })
            .limit(limit * 1)
            .skip((parseInt(page) - 1) * limit)
            .exec();

        const count = await EmployeeModel.find({
            $or: [
                { name: { $regex: `.*${search}.*`, $options: 'i' } },
                { email: { $regex: `.*${search}.*` } },
                { mobile: { $regex: `.*${search}.*` } }
            ]
        }).countDocuments();

        res.render('EmployeeDashboard', {
            employees: EmployeeData,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            previous: parseInt(page) > 1 ? parseInt(page) - 1 : null,
            next:
                parseInt(page) + 1 <= Math.ceil(count / limit)
                    ? parseInt(page) + 1
                    : null
        });
    } catch (error) {
        console.log(error.message);
    }
};

const newEmployeeLoad = async (req, res) => {
    try {
        res.render('new-employee');
    } catch (error) {
        console.log(error.message);
    }
};

const addEmployee = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const address = req.body.address;
        const shiftschedule = req.body.shiftschedule;
        const emergencycontact = req.body.emergencycontact;
        const license = req.body.license;
        const bio = req.body.bio;
        const skills = req.body.skills;
        const image = req.file.filename; 
        const password = randomstring.generate();
        const hashedPassword = await securePassword(password);
        const username = req.body.username;
        if (!hashedPassword) {
            throw new Error('Failed to hash the password');
        }

        const employee = new EmployeeModel({
            username,
            name,
            email,
            phone,
            address,
            shiftschedule,
            emergencycontact,
            license,
            image,
            bio,
            skills,
            password: hashedPassword,
            is_varified: 0,
            token: ''
        });

        const employeeLogin = new EmployeeLogin({
            username,
            password
        })

        await employeeLogin.save();
        const savedEmployee = await employee.save();

        if (savedEmployee) {
            addEmployeeMail(username,name, email, password, savedEmployee._id);
            return res.redirect('/admin/EmployeeDashboard');
        } else {
            throw new Error('Failed to save employee data');
        }
    } catch (error) {
        console.error('Error adding employee:', error.message);
        return res.status(500).render('new-employee', {
            message: 'Failed to add employee'
        });
    }
};

const editEmployeeLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const employeeData = await EmployeeModel.findById(id);
        if (employeeData) {
            res.render('edit-employee', { employee: employeeData });
        } else {
            res.redirect('/admin/EmployeeDashboard');
        }
    } catch (error) {
        console.log(error.message);
    }
};

const updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
            req.body.id,
            {
                username:req.body.username,
                name: req.body.name,
                email: req.body.email,
                phone: req.body.mno,
                is_varified: req.body.verify
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).send('Employee not found');
        }

        res.redirect('/admin/EmployeeDashboard');
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const id = req.query.id;
        const data = await EmployeeModel.findOne({_id: id});
        await EmployeeLogin.deleteOne({username:data.username});
        await EmployeeModel.deleteOne({ _id: id });
        res.redirect('/admin/EmployeeDashboard');
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

/*blood reserves*/

const loadBloodReserves = async(req,res)=>{
    try {
        res.render("BloodReserves");
    } catch (error) {
        console.log(error.message);
    }
}

//Medical Professionals
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
const loadMedical = async (req, res) => {
    try {
        var search = '';
        if (req.query.search) {
            search = req.query.search;
        }
        var page = req.query.page || '1';
        const limit = 5;

        const medicalData = await MedicalProfessional.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } },
                { mobile: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await MedicalProfessional.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } },
                { mobile: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();

        res.render('medicalProfessional', {
            employees: medicalData,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previous: page > 1 ? parseInt(page) - 1 : null,
            next: parseInt(page) + 1 <= Math.ceil(count / limit) ? parseInt(page) + 1 : null
        });
    } catch (error) {
        console.error('Error loading medical professionals:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

const newMedicalprofessionalLoad = async(req,res)=>{
    try {
        res.render('new-medicalprofessional');
    } catch (error) {
        console.log(error.message);
    }
}

const addMedicalProfessional = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const image = req.file.filename; // Check if req.file exists before accessing filename

        // Generate a random password
        const password = randomstring.generate();

        // Hash the password securely
        const hashedPassword = await securePassword(password);

        if (!hashedPassword) {
            throw new Error('Failed to hash the password');
        }

        // Create a new MedicalProfessional instance based on the MedicalProfessional model
        const medicalProfessional = new MedicalProfessional({
            name: name,
            email: email,
            mobile: mobile,
            image: image,
            password: hashedPassword,
            is_admin: 0 // Assuming this field indicates a medical professional, not an admin
        });

        // Save the medical professional data to the database
        const savedMedicalProfessional = await medicalProfessional.save();

        if (savedMedicalProfessional) {
            // Send an email to the new medical professional with their login credentials
            sendAddMedicalProfessionalMail(name, email, password, savedMedicalProfessional._id);
            return res.redirect('/admin/medicalprofessional');
        } else {
            throw new Error('Failed to save medical professional data');
        }
    } catch (error) {
        console.error('Error adding medical professional:', error.message);
        return res.status(500).render('new-medicalprofessional', { message: 'Failed to add medical professional' });
    }
};

const sendAddMedicalProfessionalMail = async (name, email, password, user_id) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });

        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'Admin added you Email verification',
            html: `<p>Hi ${name}</p>, please <a href="http://127.0.0.1:3000/Medicalprofessional/verify?id=${user_id}">click here</a> to verify<br> <b>Email:</b>${email}<br><b>Password:</b>${password}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error.message);
            } else {
                console.log("Email has been sent", info.response);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
};

const editMedicalProfessionalLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const medicalProfessionalData = await MedicalProfessional.findById(id);
        if (medicalProfessionalData) {
            res.render('edit-medicalprofessional', { medicalProfessional: medicalProfessionalData });
        } else {
            res.redirect('/admin/medicalprofessional'); // Redirect if medical professional not found
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

const updateMedicalProfessional = async (req, res) => {
    try {
        // Update the medical professional document by ID
        const updatedMedicalProfessional = await MedicalProfessional.findByIdAndUpdate(
            req.body.id,
            { 
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mno,
                is_varified: req.body.verify  // Update the is_varified field using req.body.verify
            },
            { new: true }  // Return the updated document
        );

        if (!updatedMedicalProfessional) {
            return res.status(404).send('Medical Professional not found');
        }

        res.redirect('/admin/medicalprofessional');
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};


const deleteMedicalProfessional = async (req, res) => {
    try {
        const id = req.query.id;
        await MedicalProfessional.findByIdAndDelete(id);
        res.redirect('/admin/medicalprofessional');
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};



const DonorData = async (req, res) => {
    try {
        const search = req.query.search || '';
        const page = parseInt(req.query.page) || 1;
        const limit = 5;

        const count = await DonorModel.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { bgroup: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();

        const donorData = await DonorModel.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { bgroup: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        })
        .limit(limit)
        .skip((page - 1) * limit);

        const totalPages = Math.ceil(count / limit);
        const previous = page > 1 ? page - 1 : null;
        const next = page < totalPages ? page + 1 : null;

        res.render('DonorData', {
            donors: donorData,
            totalPages: totalPages,
            currentPage: page,
            previous: previous,
            next: next
        });
    } catch (error) {
        console.error('Error loading donor data:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Edit Donor Load Controller
const editDonorLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const donorData = await DonorModel.findById(id);
        if (donorData) {
            res.render('edit-donor', { donor: donorData });
        } else {
            res.redirect('/admin/donordata');
        }
    } catch (error) {
        console.error('Error loading donor data for editing:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Update Donor Controller
const updateDonor = async (req, res) => {
    try {
        const id = req.body.id;
        const existingDonor = await DonorModel.findById(id);

        if (!existingDonor) {
            return res.status(404).send('Donor not found');
        }

        existingDonor.name = req.body.name;
        existingDonor.bgroup = req.body.bgroup;
        existingDonor.date = req.body.date;
        existingDonor.time = req.body.time;
        existingDonor.address = req.body.address;
        // existingDonor.doctor = req.body.doctor;

        const updatedDonor = await existingDonor.save();

        if (!updatedDonor) {
            throw new Error('Failed to update donor');
        }

        res.redirect('/admin/donordata');
    } catch (error) {
        console.error('Error updating donor:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

const deleteDonor = async (req, res) => {
    try {
        const id = req.query.id;
        const deletedDonor = await DonorModel.findByIdAndDelete(id);
        if (!deletedDonor) {
            return res.status(404).send('Donor not found');
        }
        res.redirect('/admin/donordata');
    } catch (error) {
        console.error('Error deleting donor:', error.message);
        res.status(500).send('Internal Server Error');
    }
};


/*********************************************************************** */
const addSupportTeamMemberMail = async (name, email, password, user_id) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });

        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'Admin added you: Email verification',
            html: `<p>Hi ${name}</p>, please <a href="http://127.0.0.1:3000/support-team/verify?id=${user_id}">click here</a> to verify<br> <b>Email:</b> ${email}<br><b>Password:</b> ${password}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error.message);
            } else {
                console.log("Email has been sent", info.response);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
};

const newSupportTeamMemberLoad = async (req, res) => {
    try {
        res.render('new-support');
    } catch (error) {
        console.log(error.message);
    }
};

const loadSupportTeam = async (req, res) => {
    try {
        let search = '';
        if (req.query.search) {
            search = req.query.search;
        }
        let page = req.query.page || '1';
        const limit = 5;

        const supportTeamData = await SupportTeamModel.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } },
                { mobile: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await SupportTeamModel.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } },
                { mobile: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();

        res.render('supportTeam', {
            supportTeamMembers: supportTeamData,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previous: page > 1 ? parseInt(page) - 1 : null,
            next: parseInt(page) + 1 <= Math.ceil(count / limit) ? parseInt(page) + 1 : null
        });
    } catch (error) {
        console.error('Error loading support team members:', error.message);
        res.status(500).send('Internal Server Error');
    }
};


const addSupportTeamMember = async (req, res) => {
    try {
        const { name, email, mobile} = req.body;
        const image = req.file.filename;
        // Generate a random password
        const password = randomstring.generate();
        const hashedPassword = await securePassword(password);
        // Check if the email or mobile number already exists
        const existingMember = await SupportTeamModel.findOne({ $or: [{ email }, { mobile }] });
        if (existingMember) {
            return res.status(400).json({ message: 'Email or mobile number already exists' });
        }

        const newMember = new SupportTeamModel({
            name,
            email,
            mobile,
            password: hashedPassword, // Ideally, the password should be hashed before saving. Consider using bcrypt for this.
            image 
        });
        const New= await newMember.save();
        if (New) {
            // Send an email to the new medical professional with their login credentials
            addSupportTeamMemberMail(name, email, password, New._id);
            return res.redirect('/admin/support');
        } else {
            throw new Error('Failed to save medical professional data');
        }
        
    } catch (error) {
        console.error('Error adding support team member:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const editSupportTeamMemberLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const supportTeamMember = await SupportTeamModel.findById(id);
        if (supportTeamMember) {
            res.render('edit-support', { supportTeam: supportTeamMember });
        } else {
            res.redirect('/admin/support');
        }
    } catch (error) {
        console.log(error.message);
    }
};

const updateSupportTeamMember = async (req, res) => {
    try {
        const id = req.body.id;
        const name = req.body.name;
        const email = req.body.email;
        const mno = req.body.mno;
        const verified = req.body.verify;
        const supportTeamMember = await SupportTeamModel.findByIdAndUpdate(id, { name: name, email: email,mobile:mno,is_varified:verified }, { new: true });
        if (supportTeamMember) {
            res.redirect('/admin/support');
        } else {
            res.redirect('/admin/support');
        }
    } catch (error) {
        console.log(error.message);
    }
};

const deleteSupportTeamMember = async (req, res) => {
    try {
        const id = req.query.id;
        await SupportTeamModel.findByIdAndDelete(id);
        res.redirect('/admin/support');
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser,
    EmployeeadminDashboard,
    newEmployeeLoad,
    editEmployeeLoad,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    loadBloodReserves,
    loadMedical,
    newMedicalprofessionalLoad,
    addMedicalProfessional,
    editMedicalProfessionalLoad,
    updateMedicalProfessional,
    deleteMedicalProfessional,
    DonorData,
    newSupportTeamMemberLoad,
    loadSupportTeam,
    addSupportTeamMember,
    editSupportTeamMemberLoad,
    updateSupportTeamMember,
    deleteSupportTeamMember,
    addSupportTeamMemberMail,
    editDonorLoad,
    updateDonor,
    deleteDonor
}