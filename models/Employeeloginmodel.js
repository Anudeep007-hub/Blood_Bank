const mongoose = require('mongoose');

const EmployeeloginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const Employeelogin = mongoose.model('Employeelogin', EmployeeloginSchema);

module.exports = Employeelogin;