const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false // Assuming address is optional
    },
    emergencyContact: {
        type: String,
        required: false // Assuming emergency contact is optional
    },
    shift: {
        type: String,
        enum: ['9:00 AM - 5:00 PM', '1:00 PM - 9:00 PM', '10:00 PM - 6:00 AM'],
        required: true
    },
    is_varified: {
        type: Number,
        default: 0 // Assuming isVerified defaults to false
    },
    token: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model("Employee", employeeSchema);
