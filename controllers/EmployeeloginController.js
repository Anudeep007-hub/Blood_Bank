const Employee = require('../models/Employeeloginmodel');
const EmployeeDetails = require('../models/Employeedetailsmodel');

async function Employeelogin(req, res) {
  const { username, password } = req.body;
  try {
    const user = await Employee.findOne({ username });
    if (!user || user.password !== password) {
      const error = 'Invalid username or password';  
      return res.status(401).send('Invalid username or password');
    }
    const Edetails = await EmployeeDetails.findOne({ username });
    if(!Edetails){
      return res.status(404).send('User details not found');
    }
    return res.render('employeeportal',{name: Edetails.name, email: Edetails.email, phone: Edetails.phone, address: Edetails.address, shiftschedule: Edetails.shiftschedule, emergencycontact: Edetails.emergencycontact, license: Edetails.license, bio: Edetails.bio, skills: Edetails.skills});
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal server error');
  }
}

module.exports = {
  Employeelogin
};
