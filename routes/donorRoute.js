const express = require('express');
const router = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const crypto = require('crypto');
const skrt = crypto.randomBytes(32).toString('hex');
const path = require('path');


router.use(session({
    secret: skrt,
    resave: false,
    cookie: { 
        secure: false,
        maxAge: 3600000 
    },
    saveUninitialized:false
}));
router.set('views', path.join('views', 'donor'));

router.set('view engine', 'ejs');


const donorControllers = require('../controllers/donor_controllers');

router.get("/DonorLogin", donorControllers.displayLogin);
router.post("/DonorLogin", donorControllers.processLogin);
router.get("/DonorRegistration", donorControllers.displayRegistrationForm);
router.post("/DonorRegistration", donorControllers.processRegistration);
router.get("/DonorDetails", donorControllers.displayDonorDetailsForm);
router.post("/DonorDetails", donorControllers.processDonorDetails);

router.get("/Appointment", donorControllers.appointmentPage);
router.post("/Appointment", donorControllers.processAppointmentForm);
router.get("/scheduledAppointment", donorControllers.appointResult);

router.get("/DonorHistory", donorControllers.donorHistoryPage);

router.get("/DonorProfile", donorControllers.donorProfilePage);
router.get("/DonorProfileEdit", donorControllers.displayedit);
router.post("/DonorProfileEdit", donorControllers.donorupdateProfile);

router.post("/DonorLogout", donorControllers.donorlogoutlog);

module.exports = router;