const mongoose = require('mongoose');

const messageLogSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    enum: ['suitorguy', 'zorucci']
  },
  eventType: {
    type: String,
    required: true,
    enum: ['booking', 'rentout']
  },
  templateName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  bookingNumber: {
    type: String,
    required: true,
    index: true
  },
  whatsappMessageId: {
    type: String
  },
  status: {
    type: String,
    enum: ['sent', 'failed', 'delivered', 'read'],
    default: 'sent'
  },
  errorMessage: {
    type: String
  },
  payload: {
    type: Object
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate sends
messageLogSchema.index({ bookingNumber: 1, eventType: 1 }, { unique: true });

module.exports = mongoose.model('MessageLog', messageLogSchema);
