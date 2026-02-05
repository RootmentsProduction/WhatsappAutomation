const express = require('express');
const { body, validationResult } = require('express-validator');
const messageService = require('../services/message.service');

const router = express.Router();

// Validation middleware
const validateSendMessage = [
  body('brand').isIn(['suitorguy', 'zorucci']).withMessage('Invalid brand'),
  body('event_type').isIn(['booking', 'rentout']).withMessage('Invalid event_type'),
  body('template_type').isIn(['withdiscount', 'nodisc']).withMessage('Invalid template_type'),
  body('customer_name').notEmpty().withMessage('customer_name is required'),
  body('customer_phone').notEmpty().withMessage('customer_phone is required'),
  body('booking_number').notEmpty().withMessage('booking_number is required'),
  body('total_amount').notEmpty().withMessage('total_amount is required'),
  body('advance_paid').notEmpty().withMessage('advance_paid is required'),
  body('balance_due').notEmpty().withMessage('balance_due is required')
];

router.post('/send', validateSendMessage, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Send message
    const result = await messageService.sendMessage(req.body);

    res.status(200).json({
      success: true,
      message: 'WhatsApp message sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Error sending message:', error);

    if (error.message.includes('already sent')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to send WhatsApp message',
      error: error.message
    });
  }
});

module.exports = router;
