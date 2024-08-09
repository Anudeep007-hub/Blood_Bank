const mongoose = require('mongoose');

const Donorschema = new mongoose.Schema({

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
    }
})

const Donordetails = mongoose.model('Donor', Donorschema);

module.exports = Donordetails;