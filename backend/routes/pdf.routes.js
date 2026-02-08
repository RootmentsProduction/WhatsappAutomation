const express = require('express');
const { body, validationResult } = require('express-validator');
const whatsappService = require('../services/whatsapp.service');

const router = express.Router();

// Validation middleware for PDF sending
const validateSendPDF = [
  body('brand').isIn(['suitorguy', 'zorucci']).withMessage('Invalid brand'),
  body('customer_phone').notEmpty().withMessage('customer_phone is required'),
  body('pdf_url').isURL().withMessage('Valid pdf_url is required'),
  body('booking_number').notEmpty().withMessage('booking_number is required')
];

// POST /pdf/send - Send PDF document
router.post('/send', validateSendPDF, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { brand, customer_phone, pdf_url, booking_number, caption } = req.body;

    // Send PDF
    const result = await whatsappService.sendDocument(
      brand,
      customer_phone,
      pdf_url,
      caption || `Invoice for ${booking_number}`,
      `${booking_number}_invoice.pdf`
    );

    res.status(200).json({
      success: true,
      message: 'PDF sent successfully',
      data: {
        messageId: result.messageId,
        bookingNumber: booking_number
      }
    });
  } catch (error) {
    console.error('Error sending PDF:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to send PDF',
      error: error.message
    });
  }
});

module.exports = router;
