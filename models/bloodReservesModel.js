// models/bloodReservesModel.js

const mongoose = require('mongoose');

// Define the schema for Blood Reserves
const bloodReservesSchema = new mongoose.Schema({
    donorID:{
        type: String,
        required:true
    },
    bloodType: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Create Blood Reserves model based on the schema
const BloodReserves = mongoose.model('BloodReserves', bloodReservesSchema);

module.exports = BloodReserves;
