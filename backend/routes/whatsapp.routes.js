const express = require('express');
const { body, validationResult } = require('express-validator');
const messageService = require('../services/message.service');

const router = express.Router();

// Validation middleware
const validateSendMessage = [
  body('brand').isIn(['suitorguy', 'zorucci']).withMessage('Invalid brand'),
  body('event_type').isIn(['booking', 'rentout', 'pdf_test']).withMessage('Invalid event_type'),
  body('template_type').optional().isIn(['withdiscount', 'nodisc', 'default']).withMessage('Invalid template_type'),
  body('customer_name').optional().notEmpty().withMessage('customer_name is required'),
  body('customer_phone').notEmpty().withMessage('customer_phone is required'),
  body('booking_number').notEmpty().withMessage('booking_number is required'),
  body('total_amount').optional().notEmpty().withMessage('total_amount is required'),
  body('advance_paid').optional().notEmpty().withMessage('advance_paid is required'),
  body('balance_due').optional().notEmpty().withMessage('balance_due is required')
];

/**
 * @swagger
 * /whatsapp/send:
 *   post:
 *     summary: Send WhatsApp notification message
 *     description: Sends a WhatsApp template message to a customer for booking or rent-out confirmation
 *     tags: [WhatsApp]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendMessageRequest'
 *           examples:
 *             booking_without_discount:
 *               summary: Booking without discount
 *               value:
 *                 brand: suitorguy
 *                 event_type: booking
 *                 template_type: nodisc
 *                 customer_name: John Doe
 *                 customer_phone: "918590292642"
 *                 booking_number: BK12345
 *                 total_amount: "5000"
 *                 discount_amount: "0"
 *                 payable_amount: "5000"
 *                 advance_paid: "2000"
 *                 balance_due: "3000"
 *             booking_with_discount:
 *               summary: Booking with discount
 *               value:
 *                 brand: suitorguy
 *                 event_type: booking
 *                 template_type: withdiscount
 *                 customer_name: Jane Smith
 *                 customer_phone: "919876543210"
 *                 booking_number: BK12346
 *                 total_amount: "5000"
 *                 discount_amount: "500"
 *                 payable_amount: "4500"
 *                 advance_paid: "2000"
 *                 balance_due: "2500"
 *             rentout_with_discount:
 *               summary: Rent-out with discount
 *               value:
 *                 brand: zorucci
 *                 event_type: rentout
 *                 template_type: withdiscount
 *                 customer_name: Mike Johnson
 *                 customer_phone: "919876543211"
 *                 booking_number: RO001
 *                 total_amount: "8000"
 *                 discount_amount: "800"
 *                 invoice_amount: "7200"
 *                 advance_paid: "3000"
 *                 balance_due: "4200"
 *                 security_deposit: "1000"
 *                 subtotal: "8200"
 *             rentout_without_discount:
 *               summary: Rent-out without discount
 *               value:
 *                 brand: zorucci
 *                 event_type: rentout
 *                 template_type: nodisc
 *                 customer_name: Sarah Williams
 *                 customer_phone: "919876543212"
 *                 booking_number: RO002
 *                 total_amount: "8000"
 *                 invoice_amount: "8000"
 *                 advance_paid: "3000"
 *                 balance_due: "5000"
 *                 security_amount: "1000"
 *                 subtotal: "9000"
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: WhatsApp message sent successfully
 *               data:
 *                 success: true
 *                 messageId: wamid.HBgMOTE4NTkwMjkyNjQyFQIAERgSOTM4QTQ0MjFENzA4OUM2RTIzAA==
 *                 bookingNumber: BK12345
 *       400:
 *         description: Bad request - validation error or duplicate message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validation_error:
 *                 value:
 *                   success: false
 *                   errors:
 *                     - msg: Invalid brand
 *                       param: brand
 *                       location: body
 *               duplicate_message:
 *                 value:
 *                   success: false
 *                   message: Message already sent for booking BK12345
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Failed to send WhatsApp message
 *               error: Invalid OAuth access token
 */
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
