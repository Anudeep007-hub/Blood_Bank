const mongoose = require('mongoose');

const EmployeeDetailsSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String},
  shiftschedule: { type: String },
  emergencycontact: { type: String },
  license: { type: String },
  bio: { type: String },
  skills: [{ type: String }],
  is_varified:{
    type:Number,
    default:0
  },
  role:{
    type:String,
    enum:['admin','donor','employee','medic','support'],
    default: 'employee'
},
is_varified:{
  type:Number,
  default:0
}
});

// Create the UserDetails model using the schema
const EmployeeDetails = mongoose.model('EmployeeDetails', EmployeeDetailsSchema);

module.exports = EmployeeDetails;
