const express = require("express");
const employee_route = express();
const session = require("express-session");

const config = require("../config/config");

employee_route.use(session({
    secret: config.sessionSecret,
    resave: false,
    cookie: { 
        secure: false,
        maxAge: 3600000 
    },
    saveUninitialized:false 
}));
const auth = require("../middleware/employeeAuth");

const employeeController = require("../controllers/employeeController");

employee_route.set('view engine', 'ejs');
employee_route.set('views', './views/employee');
employee_route.set('views', './views');


const bodyParser = require('body-parser');

employee_route.use(bodyParser.json());
employee_route.use(bodyParser.urlencoded({ extended: true }));

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/employeeImages'));
    },
    filename: function(req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
})

const upload = multer({ storage: storage });

// employee_route.get('/register', auth.isLogout, employeeController.loadRegister);

// employee_route.post('/register', upload.single('image'), employeeController.insertEmployee);

employee_route.get('/verify', employeeController.verifyMail);

// employee_route.get('/', auth.isLogout, employeeController.loginLoad);

// employee_route.get('/login', auth.isLogout, employeeController.loginLoad);

// employee_route.post('/login', employeeController.verifyLogin);

// employee_route.get('/home', auth.isLogin, employeeController.loadHome);

employee_route.get('/logout', auth.isLogin, employeeController.userLogout);

employee_route.get('/forget', auth.isLogout, employeeController.forgetLoad);

employee_route.post('/forget', employeeController.forgetVerify);

employee_route.get('/forget-password', auth.isLogout, employeeController.forgetPasswordLoad);

employee_route.post('/forget-password', employeeController.resetPassword);

employee_route.get('/verification', employeeController.verificationLoad);

employee_route.post('/verification', employeeController.sendVerificationLink);

employee_route.get('/edit', auth.isLogin, employeeController.editLoad);

// Remove the duplicate route definition for '/edit'
// employee_route.get('/edit', auth.isLogin, employeeController.editLoad);

employee_route.post('/edit', upload.single('image'), employeeController.updateProfile);

employee_route.use(express.static('public'));

module.exports = employee_route;
