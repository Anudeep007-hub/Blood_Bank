const path = require('path');
const { DonorModel, ScheduleModel} = require('../models/donorModel'); 
const bcrypt = require('bcrypt');


exports.displayLogin = (req, res) => {
    res.render('Donor_login');
};



exports.processLogin = async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await DonorModel.findOne({ name });

        if (!user) {
            return res.status(401).send("Invalid credentials. Please try again.");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            req.session.userId = user._id;
            res.redirect('/donor/donorProfile');
        } else {
            return res.status(401).send("Invalid credentials. Please try again.");
        }

    } catch (error) {
        console.error("Error :", error);
        return res.status(500).send("Internal server error");
    }
};

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/donor/DonorLogin');
    }
};

exports.isAuthenticated = isAuthenticated;


exports.displayRegistrationForm = (req, res) => {
    res.render('Donor_reg');
};
exports.processRegistration = async (req, res) => {
    const { name, password, confirmPassword } = req.body;
    try {
        
        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const confhashpass = await bcrypt.hash(confirmPassword, 10);

        const existingUser = await DonorModel.findOne({ name });

        if (existingUser) {
            return res.status(400).send(`
                <script>alert('User with this name already exists. Please choose a different name.');</script>
                <a href="/donor/DonorRegistration">Go back to registration</a>
            `);
        }
        res.redirect(`/donor/DonorDetails?name=${encodeURIComponent(name)}&password=${encodeURIComponent(hashedPassword)}&confirmPassword=${encodeURIComponent(confhashpass)}`);
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send(`
            <script>alert('Internal server error. Please try again later.');</script>
            <a href="/donor/DonorRegistration">Go back to registration</a>
        `);
    }
};

exports.displayDonorDetailsForm = (req, res) => {
    res.render('Donor_reg_details');
};
exports.processDonorDetails = async (req, res) => {
    const { name, password, confirmPassword, fname, lname,email, gend, age, phone, bgroup, address, ID, idnumber } = req.body;
    try {
        await DonorModel.create({ name, password, confirmPassword, fname, lname,email, gend, age, phone, bgroup, address, ID, idnumber });
        res.redirect("/donor/DonorLogin");
    } catch (error) {
        console.error("Error inserting donor details:", error);
        res.status(500).send("Internal server error");
    }
};

exports.appointmentPage = (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.redirect('/donor/DonorLogin');
        }

        res.render("schedule_appo");

    } catch (error) {
        res.status(500).send("Internal server error");
    }
    
};
exports.processAppointmentForm = async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.redirect('/donor/DonorLogin');
        }
        const {date, time, address} = req.body;

        const user = await DonorModel.findById(userId);
        if (!user) {
            return res.status(404).send("User details not found");
        }

        if (!date || !time || !address ) {
            throw new Error('Date, time, address, and checkbox acceptance are required fields.');
        }

        const newSchedule = new ScheduleModel({
            name : user.name,
            bgroup: user.bgroup,
            date: new Date(date), 
            time: time,
            address: address,
        });

        await newSchedule.save();
        res.redirect('/donor/scheduledAppointment'); 
    } catch (error) {
        console.error("Error creating schedule:", error);
        res.status(500).send(`An error occurred while processing your request: ${error.message}`);
    }
};


exports.appointResult = (req,res) => {
    res.render("schedule_response");
}

exports.donorHistoryPage = (req, res) => {
    res.render("donation_hist");
};
exports.donorProfilePage = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.redirect('/donor/DonorLogin');
        }

        const donorDetails = await DonorModel.findOne({ _id: userId });  
        if (!donorDetails) {
            return res.status(404).send("Donor details not found");
        }

        res.render('manage_don_prof', { donorDetails });
    } catch (error) {
        console.error("Error fetching donor details:", error);
        res.status(500).send("Internal server error");
    }
};
exports.displayedit = (req, res) => {
    res.render('Donor_edit_profile');
};
exports.donorupdateProfile = async(req,res)=>{
    try {
        await DonorModel.findByIdAndUpdate({$set:{name:req.body.edit_peru , email:req.body.edit_email, phone:req.body.edit_phone,address:req.body.edit_address}});
        res.redirect('/DonorProfile');
    } catch (error) {
        console.log(error.message);
    }
};
exports.donorlogoutlog = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send("Internal server error");
        }
        
        res.redirect("/"); 
    });
}
