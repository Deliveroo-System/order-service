const UserDetails = require('../models/UserDetails');

exports.createUserDetails = async (req, res) => {
  try {
    const {
      customerName,
      phoneNumber,
      address,
      city,
      zipCode,
      paymentMethod,
      cardDetails, // Optional, if paymentMethod is Card
      items,
      totalAmount
    } = req.body;

    const newDetails = new UserDetails({
      userId: req.user.userId,
      customerName,
      phoneNumber,
      address,
      city,
      zipCode,
      paymentMethod,
      cardDetails: paymentMethod === 'Card' ? cardDetails : undefined,
      items,
      totalAmount
    });

    const savedDetails = await newDetails.save();
    res.status(201).json(savedDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error saving user details', error });
  }
};
