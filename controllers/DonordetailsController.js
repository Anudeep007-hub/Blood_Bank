const {DonorModel} = require('../models/donorModel');
exports.getDonordata = async (req, res) => {
  try {
    const items = await DonorModel.find();
    res.render('donordetails', { items });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};
