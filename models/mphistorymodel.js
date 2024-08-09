// mphistorymodel.js
const mongoose = require('mongoose');

const mphistorySchema = new mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donormodel' // Reference to the Donor model
    },
    name:{
        type:String,
        // required:true
    },
    action: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('mphistory', mphistorySchema);