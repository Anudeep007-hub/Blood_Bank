const mongoose = require("mongoose");



const DonorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gend: {
        type: String,
        enum: ['male','female','others'],
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    bgroup: {
        type: String,
        enum: ['AB-Ve','AB+Ve','A-Ve','A+Ve','B-Ve','B+Ve','O-Ve','O+Ve'],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    ID: {
        type: String,
        enum: ['Aadhar','Driving License','PAN','Passport','Voter ID'],
        required: true
    },
    idnumber: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                const selectedID = this.ID;

                let regex, validationMessage;
                switch (selectedID) {
                    case "Aadhar":
                        regex = /^\d{12}$/; 
                        validationMessage = "Invalid Aadhar number!";
                        break;
                    case "Driving License":
                        regex = /^[A-Za-z0-9]{16}$/; 
                        validationMessage = "Invalid Driving License number!";
                        break;
                    case "PAN":
                        regex = /^[A-Za-z0-9]{10}$/; 
                        validationMessage = "Invalid PAN number!";
                        break;
                    case "Passport":
                        regex = /^[A-Za-z0-9]{12}$/; 
                        validationMessage = "Invalid passport number!";
                        break;
                    case "Voter ID":
                        regex = /^[A-Za-z0-9]{10}$/; 
                        validationMessage = "Invalid Voter ID number!";
                        break;
                    default:
                        return true; 
                }
                if (!regex.test(v)) {
                    throw new Error(validationMessage);
                }
                return true;
            },
            message: props => props.reason.message 
        }
    },
    is_verified_by_mp:{
        type:Number,
        default:0
    },
    doctor:{
        type:String,
        default:""
    },
    role:{
        type:String,
        enum:['admin','donor','employee','medic','support'],
        default: 'donor'
    }
});

const Schedule = new mongoose.Schema({

    name: {
        type:String,
        required: true
    },
    bgroup: {
        type: String,
        enum: ['AB-Ve','AB+Ve','A-Ve','A+Ve','B-Ve','B+Ve','O-Ve','O+Ve'],
        required: true
    },

    date : {
       type: Date,
       required: true
    },
    time : {
       type: String,
       required: true
    },
    address : {
       type: String,
       required: true
    },
    doctor : {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ['admin','donor','employee','medic','support'],
        default: 'donor'
    }
})

const DonorModel = mongoose.model("DonorModel", DonorSchema);
const ScheduleModel = mongoose.model("Schedule", Schedule);

module.exports = { DonorModel , ScheduleModel};
