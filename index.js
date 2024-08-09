require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/BloodBank"); 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const Employeelogincontroller = require('./controllers/EmployeeloginController');
const PatientBloodRequestcontroller = require('./controllers/patientBloodRequestController');
const DonordetailsController = require('./controllers/DonordetailsController');
const employeeController=require('./controllers/employeeController');

//-------------------------------------------------------------------

app.use(express.static(path.join(__dirname, 'views')));
app.set('views', path.join(__dirname, 'views'));

// app.use('views','../views/donor');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/recipientportal' ,(req,res)=>{
    res.render('recipientportal')
})

app.post('/recipientportal',PatientBloodRequestcontroller.submitBloodRequest)


app.get('/employeelogin',(req,res)=>{
    res.render('employeelogin')
})

app.post('/employeelogin',Employeelogincontroller.Employeelogin)

//user routes
// const userRoute = require('./routes/donorlogin');
// app.use('/donorlogin',userRoute);

const donorRoute = require('./routes/donorRoute');
app.use('/donor',donorRoute);

//admin routes
const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute);


//employee routes    
// const employeeRoute = require('./routes/employeeRoute');
// app.use('/employee',employeeRoute);

const support = require('./routes/supportRoute');
app.use('/support-team',support);
//medicalProfessional routes
const MedicalProfessionalRoute = require('./routes/medicalProfessionalRoute');
app.use('/Medicalprofessional',MedicalProfessionalRoute);


//routes
app.get('/aboutus',(req,res)=>{
    res.render('aboutus')
});
app.get('/privacypolicy',(req,res)=>{
    res.render('privacypolicy')
})
app.get('/terms',(req,res)=>{
    res.render('terms')
})

app.get('/employee/verify', employeeController.verifyMail);


app.get('/faq',(req,res)=>{
    res.render('faq')
})
app.get('/disclaimer',(req,res)=>{
    res.render('aboutus')
})
app.get('/contactus',(req,res)=>{
    res.render('contactus')
})

app.get('/employeeeditprofile',(req,res)=>{
    res.render('employeeeditprofile')
})
app.get('/recipientportal' ,(req,res)=>{
    res.render('recipientportal')
})
app.post('/recipientportal',PatientBloodRequestcontroller.submitBloodRequest)
app.get('/adminlogin',(req,res)=>{
    res.render('adminlogin')
})

app.get('/donordetails', DonordetailsController.getDonordata);
app.get('/sendfeedback',(req,res)=>{
    res.render('sendfeedback')
})
app.post('/update-doctor',employeeController.updateDoctorName),
app.get('/update-doctor',(req,res)=>{
    res.send("Updated Successfully");
}),

app.listen(3000,function(){
    console.log("server running at port 3000...")
})