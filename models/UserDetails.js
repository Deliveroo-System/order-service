const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  orderId: {
    type: String,
    ref: 'Order',
    required: true
  },
  customerName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card'],
    default: 'Cash',
  },
  cardDetails: {
    cardNumber: { type: String },
    expiryDate: { type: String },
    cvv: { type: String },
  },
  items: [
    {
      name: String,
      qty: Number,
      price: Number,
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },

  // Restaurant/Item details
  restaurantId: String,
  deliveryId: String,
  categoryId: String,
  menus: [
    {
      menuId: { type: String, required: true },
      menuName: { type: String, required: true },
      items: [
        {
          menuItemId: { type: String, required: true },
          menuItemName: { type: String, required: true },
          qty: { type: Number, required: true },
          price: { type: Number, required: true }
        }
      ]
    }
  ],

  // Statuses
  restaurantAdmin: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  deliver: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  customerOrderRecive: {
    type: String,
    enum: ['Pending', 'Success'],
    default: 'Pending'
  },

  statusHistory: [
    {
      statusType: String,
      value: String,
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  status: {
    type: String,
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('UserDetails', userDetailsSchema);
