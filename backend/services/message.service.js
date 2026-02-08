const MessageLog = require('../models/MessageLog');
const whatsappService = require('./whatsapp.service');
const templatesConfig = require('../config/templates.config');
const whatsappConfig = require('../config/whatsapp.config');

class MessageService {
  async sendMessage(payload) {
    const {
      brand,
      event_type,
      template_type,
      booking_number,
      customer_phone
    } = payload;

    // Check for duplicate (skip if MongoDB not connected)
    try {
      const existingLog = await MessageLog.findOne({
        bookingNumber: booking_number,
        eventType: event_type
      });

      if (existingLog) {
        throw new Error(`Message already sent for ${event_type} ${booking_number}`);
      }
    } catch (error) {
      if (error.message.includes('already sent')) throw error;
      console.log('MongoDB not connected, skipping duplicate check');
    }

    // Get template configuration
    const template = templatesConfig[event_type]?.[template_type];
    if (!template) {
      throw new Error(`Invalid event_type or template_type`);
    }

    // Get brand configuration
    const brandConfig = whatsappConfig[brand];
    if (!brandConfig) {
      throw new Error(`Invalid brand: ${brand}`);
    }

    // Map variables
    const variables = this.mapVariables(payload, template.variables, brandConfig);

    // Check if template supports PDF in header
    const pdfUrl = template.hasPdfHeader ? payload.pdf_url : null;

    try {
      // Send WhatsApp message (with PDF if template supports it)
      const result = await whatsappService.sendTemplateMessage(
        brand,
        template.name,
        customer_phone,
        variables,
        pdfUrl
      );

      // Log to database if connected
      try {
        const messageLog = new MessageLog({
          brand,
          eventType: event_type,
          templateName: template.name,
          customerPhone: customer_phone,
          bookingNumber: booking_number,
          status: 'sent',
          whatsappMessageId: result.messageId,
          payload
        });
        await messageLog.save();
      } catch (dbError) {
        console.log('MongoDB logging failed:', dbError.message);
      }

      // Send PDF if provided
      if (payload.pdf_url) {
        try {
          await whatsappService.sendDocument(
            brand,
            customer_phone,
            payload.pdf_url,
            `${event_type === 'booking' ? 'Booking' : 'Rent-out'} Invoice - ${booking_number}`,
            `${booking_number}_invoice.pdf`
          );
          console.log('PDF sent successfully');
        } catch (pdfError) {
          console.error('Failed to send PDF:', pdfError.message);
          // Don't fail the whole request if PDF fails
        }
      }

      return {
        success: true,
        messageId: result.messageId,
        bookingNumber: booking_number
      };
    } catch (error) {
      // Try to log failure
      try {
        const messageLog = new MessageLog({
          brand,
          eventType: event_type,
          templateName: template.name,
          customerPhone: customer_phone,
          bookingNumber: booking_number,
          status: 'failed',
          errorMessage: error.message,
          payload
        });
        await messageLog.save();
      } catch (dbError) {
        console.log('MongoDB logging failed:', dbError.message);
      }
      throw error;
    }
  }

  mapVariables(payload, variableNames, brandConfig) {
    // Calculate discount percentage if needed
    const totalAmount = parseFloat(payload.total_amount || 0);
    const discountAmount = parseFloat(payload.discount_amount || 0);
    const discountPercentage = totalAmount > 0 ? Math.round((discountAmount / totalAmount) * 100) : 0;
    
    const mapping = {
      customer_name: payload.customer_name,
      booking_number: payload.booking_number,
      total_amount: payload.total_amount,
      discount_amount: payload.discount_amount || '0',
      discount_percentage: String(discountPercentage), // Calculate percentage
      payable_amount: payload.payable_amount,
      invoice_amount: payload.invoice_amount,
      advance_paid: payload.advance_paid,
      balance_due: payload.balance_due,
      security_deposit: payload.security_deposit,
      security_amount: payload.security_amount,
      subtotal: payload.subtotal,
      brand_name: brandConfig.displayName,
      brand_contact: brandConfig.businessPhone
    };

    return variableNames.map(varName => mapping[varName] || '');
  }
}

module.exports = new MessageService();
