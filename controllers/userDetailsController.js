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

    // Ensure req.user is populated by authMiddleware
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized. User ID not found in token." });
    }

    // Extract userId from req.user
    const userId = req.user.userId;

    // Create a new UserDetails document
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

    // Save the document to the database
    const savedDetails = await newDetails.save();
    res.status(201).json({ message: "User details saved successfully", userDetails: savedDetails });
  } catch (error) {
    res.status(500).json({ message: 'Error saving user details', error: error.message });
  }
};
