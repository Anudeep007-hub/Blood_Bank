const PatientBloodRequest = require('../models/Patientdetailsmodel');

async function submitBloodRequest(req, res) {
  const {
    patientName,
    bloodType,
    hospitalName,
    contactNumber,
    requiredUnits,
    urgencyLevel,
    dateNeeded,
    additionalInfo,
    doctor
  } = req.body;

  try {
    const bloodRequest = new PatientBloodRequest({
      patientName: patientName,
      bloodType: bloodType,
      hospitalName: hospitalName,
      contactNumber: contactNumber,
      requiredUnits: requiredUnits,
      urgencyLevel: urgencyLevel,
      dateNeeded: dateNeeded,
      additionalInfo: additionalInfo,
      doctor: doctor
    });

    // Save the data to the database
    await bloodRequest.save();

    // Redirect to a success page or any other page
    res.status(200).send('Data Registered Succesfully')
  } catch (error) {
    console.error('Error submitting blood request:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  submitBloodRequest
};
