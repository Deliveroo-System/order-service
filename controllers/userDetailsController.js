const UserDetails = require('../models/UserDetails');

const { generateToken } = require("../middleware/generateToken");

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

    // Extract userId from the token
    const userId = req.user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. User ID not found in token." });
    }

    const newDetails = new UserDetails({
      userId,
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
