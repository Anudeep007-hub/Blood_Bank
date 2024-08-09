const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const randomstring = require("randomstring");
const DonorModel = require('../models/donorModel').DonorModel;
const User = require('../models/supportTeamModel');
const SupportTeam = User.ST;
const UserTrouble = User.UserTrouble;
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

const sendResetPasswordMail = async (name, email, token) => {
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
            subject: 'Password Reset',
            html: `<p>Hi ${name},</p><p>Please <a href="http://127.0.0.1:3000/support-team/forget-password?token=${token}">click here</a> to continue password reset</p>`
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
}

const sendVerifyMail = async (name, email, user_id) => {
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
            subject: 'Email Verification',
            html:`<p>Hi ${name},</p><p>Please <a href="http://127.0.0.1:3000/support-team/verify?id=${user_id}">click here</a> to verify your email</p>`
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
}

const verifyMail = async (req, res) => {
    try {
        const updateInfo = await SupportTeam.updateOne({ _id: req.query.id }, { $set: { is_varified: 1 } });
        console.log(updateInfo);
        res.render("email-verified");
    } catch (error) {
        console.log(error.message);
    }
}

const loginLoad = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const supportTeamData = await SupportTeam.findOne({ email: email });
        if (supportTeamData) {
            const passwordMatch = await bcrypt.compare(password, supportTeamData.password);
            if (passwordMatch) {
                if (supportTeamData.is_varified === 0) {
                    res.render('login', { message: "Please verify your email" });
                } else {
                    req.session.supportTeam_id = supportTeamData._id;
                    res.redirect('/support-team/home');
                }
            } else {
                res.render('login', { message: "Email and password incorrect" });
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadHome = async (req, res) => {
    try {
        const supportTeamData = await SupportTeam.findById({ _id: req.session.supportTeam_id });
        res.render('home', { user: supportTeamData });
    } catch (error) {
        console.log(error.message);
    }
}

const userLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}

const forgetLoad = async (req, res) => {
    try {
        res.render('forget');
    } catch (error) {
        console.log(error.message);
    }
}

const forgetVerify = async (req, res) => {
    try {
        const email = req.body.email;
        const supportTeamData = await SupportTeam.findOne({ email: email });
        if (supportTeamData) {
            if (supportTeamData.is_varified === 0) {
                res.render('forget', { message: "Email not verified!" });
            } else {
                const randomString = randomstring.generate();
                await SupportTeam.updateOne({ email: email }, { $set: { token: randomString } });
                sendResetPasswordMail(supportTeamData.name, supportTeamData.email, randomString);
                res.render('forget', { message: "Please check your mail to reset your password" });
            }
        } else {
            res.render('forget', { message: "User email is incorrect" });
        }
    } catch (error) {
        console.log(error.message);
    }
}

const resetPassword = async (req, res) => {
    try {
        const passwordHash = req.body.password;
        const supportTeam_id = req.body.supportTeam_id;

        const secure_password = await securePassword(passwordHash);
        const updatedData = await SupportTeam.findByIdAndUpdate({ _id: supportTeam_id }, { $set: { password: secure_password, token: '' } });
        res.redirect("/support-team/home");
    } catch (error) {
        console.log(error.message);
    }
}

const forgetPasswordLoad = async (req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await SupportTeam.findOne({ token: token });
        if (tokenData) {
            if (tokenData.token === token) {
                res.render('forget-password', { supportTeam_id: tokenData._id });
            } else {
                res.render('404', { message: "Token is invalid" });
            }
        } else {
            res.render('404', { message: "Token is invalid" });
        }
    } catch (error) {
        console.log(error.message);
    }
}

const verificationLoad = async (req, res) => {
    try {
        res.render('verification');
    } catch (error) {
        console.log(error.message);
    }
}

const sendVerificationLink = async (req, res) => {
    try {
        const email = req.body.email;
        const supportTeamData = await SupportTeam.findOne({ email: email });
        if (supportTeamData) {
            sendVerifyMail(supportTeamData.name, supportTeamData.email, supportTeamData._id);
            res.render('verification', { message: "Verification mail sent to your email, please check" });
        } else {
            res.render("verification", { message: "This email doesn't exist" });
        }
    } catch (error) {
        console.log(error.message);
    }
}

const editLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const supportTeamData = await SupportTeam.findById({ _id: id });
        if (supportTeamData) {
            res.render('edit', { user: supportTeamData });
        } else {
            res.redirect('/support-team/home');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const updateProfile = async (req, res) => {
    try {
        if (req.file) {
            const supportTeamData = await SupportTeam.findByIdAndUpdate({ _id: req.body.supportTeam_id }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mno, image: req.file.filename } });
        } else {
            const supportTeamData = await SupportTeam.findByIdAndUpdate({ _id: req.body.supportTeam_id }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mno } });
        }
        res.redirect('/support-team/home');
    } catch (error) {
        console.log(error.message);
    }
}

const listUnverifiedUsers = async (req, res) => {
    try {
        const donorData = await DonorModel.find();
        res.render('unverified', {
            donors: donorData
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error fetching data from database");
    }
}

const listUserFeedbacks = async (req, res) => {
    try {
        const userFeedbacks = await UserTrouble.find();
        console.log(userFeedbacks); // Log user feedbacks to see what's being fetched
        res.render('user-feedback', { userFeedbacks });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error fetching user feedbacks from database");
    }
}

const feedbackForm = (req, res) => {
    res.render('feedbackForm');
}
const submitFeedback = async (req, res) => {
    try {
        // Extract user and trouble from request body
        const { user, trouble } = req.body;

        // Create a new UserTrouble document
        const newFeedback = new UserTrouble({
            user: user,
            trouble: trouble
        });

        // Save the new feedback document to the database
        await newFeedback.save();

        // Redirect to a thank you page or wherever you need to go next
        res.send('thank you, your feedback form is submitted successfully');
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error submitting feedback");
    }
}

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
    listUnverifiedUsers,
    listUserFeedbacks,
    feedbackForm,
    submitFeedback
};