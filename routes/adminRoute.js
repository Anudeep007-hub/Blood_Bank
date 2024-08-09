const express = require("express");

const admin_route = express();
const config = require("../config/config");
const session = require("express-session");
admin_route.use(session({
    secret: config.sessionSecret,
    resave: false,
    cookie: { 
        secure: false,
        maxAge: 3600000 
    },
    saveUninitialized:false 
}));



const bodyParser = require("body-parser");

admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

admin_route.use(express.static('public'));
admin_route.use('/medicalProfessionalImages', express.static('../public/medicalProfessionalImages'));

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/userImages'));
    },
    filename: function(req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const storageEmp = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/employeeImages'));
    },
    filename: function(req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const storageMP = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/medicalProfessionalImages'));
    },
    filename: function(req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});


const storageSup = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/supportTeamImages'));
    },
    filename: function(req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const uploadEmp = multer({ storage: storageEmp });

const uploadMP = multer({ storage: storageMP });

const upload = multer({ storage: storage });

const uploadSup = multer({storage: storageSup});

const auth = require("../middleware/adminAuth");

const adminController = require("../controllers/adminController");
const exp = require("constants");

admin_route.get('/',auth.isLogout,adminController.loadLogin);


admin_route.post('/',adminController.verifyLogin);

admin_route.get('/home',auth.isLogin,adminController.loadDashboard);

admin_route.get('/logout',auth.isLogin,adminController.logout);

admin_route.get('/forget',auth.isLogout,adminController.forgetLoad);

admin_route.post('/forget',adminController.forgetVerify);

admin_route.get('/forget-password',auth.isLogout,adminController.forgetPasswordLoad);

admin_route.post('/forget-password',adminController.resetPassword);

admin_route.get('/dashboard',auth.isLogin,adminController.adminDashboard);

admin_route.get('/new-user',auth.isLogin,adminController.newUserLoad);

admin_route.post('/new-user',auth.isLogin,upload.single('image'),adminController.addUser);

admin_route.get('/edit-user',auth.isLogin,adminController.editUserLoad);

admin_route.post('/edit-user',adminController.updateUsers);

admin_route.get('/delete-user',adminController.deleteUser);

admin_route.get('/EmployeeDashboard',auth.isLogin,adminController.EmployeeadminDashboard);

admin_route.get('/new-employee',auth.isLogin,adminController.newEmployeeLoad);

admin_route.post('/new-employee', auth.isLogin, uploadEmp.single('image'), adminController.addEmployee);


admin_route.get('/edit-employee',auth.isLogin,adminController.editEmployeeLoad);

admin_route.post('/edit-employee',adminController.updateEmployee);

admin_route.get('/delete-employee',adminController.deleteEmployee);

admin_route.get('/bloodreserves',auth.isLogin,adminController.loadBloodReserves);

admin_route.get('/new-medicalprofessional',auth.isLogin,adminController.newMedicalprofessionalLoad);

admin_route.get('/medicalprofessional',auth.isLogin,adminController.loadMedical)

admin_route.post('/medicalprofessional',auth.isLogin, uploadMP.single('image'), adminController.addMedicalProfessional);

admin_route.get('/edit-mp',auth.isLogin,adminController.editMedicalProfessionalLoad);

admin_route.post('/edit-mp',adminController.updateMedicalProfessional);

admin_route.get('/delete-mp',adminController.deleteMedicalProfessional);

admin_route.get('/edit-donor', adminController.editDonorLoad);
// Route to handle updating donor information
admin_route.post('/edit-donor', adminController.updateDonor);

// Route to handle deleting a donor record
admin_route.get('/delete-donor', adminController.deleteDonor);

// Route to render the donor data page
admin_route.get('/donordata', auth.isLogin, adminController.DonorData);
// Render form to add a new support team member
admin_route.get('/new-support', auth.isLogin, adminController.newSupportTeamMemberLoad);

// View all support team members
admin_route.get('/support', auth.isLogin, adminController.loadSupportTeam);

// Add a new support team member
admin_route.post('/support', auth.isLogin, uploadSup.single('image'), adminController.addSupportTeamMember);

// Render form to edit a support team member
admin_route.get('/edit-support', auth.isLogin, adminController.editSupportTeamMemberLoad);

// Update a support team member
admin_route.post('/edit-support', adminController.updateSupportTeamMember);

// Delete a support team member
admin_route.get('/delete-support', adminController.deleteSupportTeamMember);


admin_route.get('*',function(req,res){
    res.redirect('/admin');
});

module.exports = admin_route;