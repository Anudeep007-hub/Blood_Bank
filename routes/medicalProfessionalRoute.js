const express = require("express");
const medicalProfessionalRoute = express();
const session = require("express-session");

const config = require("../config/config");
const {DonorModel} = require('../models/donorModel');
const History = require('../models/mphistorymodel');

medicalProfessionalRoute.use(session({
    secret: config.sessionSecret,
    resave: false,
    cookie: { 
        secure: false,
        maxAge: 3600000 
    },
    saveUninitialized:false 
}));
const auth = require("../middleware/medicalProfessionalAuth");

const medicalProfessionalController = require("../controllers/medicalProfessionalController");

medicalProfessionalRoute.set('view engine', 'ejs');
medicalProfessionalRoute.set('views', './views/medicalProfessional');

const bodyParser = require('body-parser');

medicalProfessionalRoute.use(bodyParser.json());
medicalProfessionalRoute.use(bodyParser.urlencoded({ extended: true }));

const multer = require("multer");
const path = require("path");

medicalProfessionalRoute.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/medicalProfessionalImages'));
    },
    filename: function(req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
})

const upload = multer({ storage: storage });

// medicalProfessionalRoute.get('/register', auth.isLogout, medicalProfessionalController.loadRegister);

// medicalProfessionalRoute.post('/register', upload.single('image'), medicalProfessionalController.insertMedicalProfessional);

medicalProfessionalRoute.get('/verify', medicalProfessionalController.verifyMail);

medicalProfessionalRoute.get('/', auth.isLogout, medicalProfessionalController.loginLoad);

medicalProfessionalRoute.get('/login', auth.isLogout, medicalProfessionalController.loginLoad);

medicalProfessionalRoute.post('/login', medicalProfessionalController.verifyLogin);

medicalProfessionalRoute.get('/home', auth.isLogin, medicalProfessionalController.loadHome);

medicalProfessionalRoute.get('/logout', auth.isLogin, medicalProfessionalController.userLogout);

medicalProfessionalRoute.get('/forget', auth.isLogout, medicalProfessionalController.forgetLoad);

medicalProfessionalRoute.post('/forget', medicalProfessionalController.forgetVerify);

medicalProfessionalRoute.get('/forget-password', auth.isLogout, medicalProfessionalController.forgetPasswordLoad);

medicalProfessionalRoute.post('/forget-password', medicalProfessionalController.resetPassword);

medicalProfessionalRoute.get('/verification', medicalProfessionalController.verificationLoad);

medicalProfessionalRoute.post('/verification', medicalProfessionalController.sendVerificationLink);

medicalProfessionalRoute.get('/edit', auth.isLogin, medicalProfessionalController.editLoad);

medicalProfessionalRoute.post('/edit', upload.single('image'), medicalProfessionalController.updateProfile);

medicalProfessionalRoute.get('/unverified', medicalProfessionalController.unverified);


medicalProfessionalRoute.get('/history', auth.isLogin, medicalProfessionalController.showHistory);



medicalProfessionalRoute.get('/accept-mp', async (req, res) => {
    try {
        const donorId = req.query.id;
        // Update the donor status in the database
        const user=await DonorModel.findByIdAndUpdate(donorId, { is_verified_by_mp: 1 });

        // Create history entry
        await History.create({
            donorId: donorId,
            name:user.name,
            action: 'accepted',
            time: new Date()
        });

        res.status(200).send('Donor status updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

medicalProfessionalRoute.get('/reject-mp', async (req, res) => {
    try {
        const donorId = req.query.id;

        // Update the donor status in the database
        const user=await DonorModel.findByIdAndUpdate(donorId, { is_verified_by_mp: 0 });

        // Create history entry
        await History.create({
            donorId: donorId,
            name:user.name,
            action: 'rejected',
            time: new Date()
        });
        res.status(200).send('Donor status rejected successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = medicalProfessionalRoute;



module.exports = medicalProfessionalRoute;