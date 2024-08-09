const express = require("express");
const supportTeamRoute = express();
const session = require("express-session");


const config = require("../config/config");
const supportTeamController = require("../controllers/supportTeamController");
const donorModel = require('../models/donorModel');
const DonorModel = donorModel.DonorModel;

supportTeamRoute.use(session({
    secret: config.sessionSecret,
    resave: false,
    cookie: { 
        secure: false,
        maxAge: 3600000 
    },
    saveUninitialized: false
}));

const auth = require("../middleware/supportTeamAuth");

supportTeamRoute.set('view engine', 'ejs');
supportTeamRoute.set('views', './views/supportTeam');

const bodyParser = require('body-parser');
supportTeamRoute.use(bodyParser.json());
supportTeamRoute.use(bodyParser.urlencoded({ extended: true }));

const multer = require("multer");
const path = require("path");

supportTeamRoute.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/supportTeamImages'));
    },
    filename: function(req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage: storage });

// Routes for Support Team

supportTeamRoute.get('/verify', supportTeamController.verifyMail);

supportTeamRoute.get('/', auth.isLogout, supportTeamController.loginLoad);
supportTeamRoute.get('/login', auth.isLogout, supportTeamController.loginLoad);
supportTeamRoute.post('/login', supportTeamController.verifyLogin);
supportTeamRoute.get('/home', auth.isLogin, supportTeamController.loadHome);
supportTeamRoute.get('/logout', auth.isLogin, supportTeamController.userLogout);
supportTeamRoute.get('/forget', auth.isLogout, supportTeamController.forgetLoad);
supportTeamRoute.post('/forget', supportTeamController.forgetVerify);
supportTeamRoute.get('/forget-password', auth.isLogout, supportTeamController.forgetPasswordLoad);
supportTeamRoute.post('/forget-password', supportTeamController.resetPassword);
supportTeamRoute.get('/verification', supportTeamController.verificationLoad);
supportTeamRoute.post('/verification', supportTeamController.sendVerificationLink);
supportTeamRoute.get('/edit', auth.isLogin, supportTeamController.editLoad);
supportTeamRoute.post('/edit', upload.single('image'), supportTeamController.updateProfile);
supportTeamRoute.get('/unverified', auth.isLogin, supportTeamController.listUnverifiedUsers);
supportTeamRoute.get('/history',supportTeamController.listUserFeedbacks);
supportTeamRoute.get('/feedback-form', supportTeamController.feedbackForm);
supportTeamRoute.post('/submit-feedback', supportTeamController.submitFeedback);



module.exports = supportTeamRoute;