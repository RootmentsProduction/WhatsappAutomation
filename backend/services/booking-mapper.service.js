/**
 * Service to automatically map Rootments API booking data to WhatsApp API format
 * Automatically detects:
 * - Event type (booking vs rentout)
 * - Template type (withdiscount vs nodisc)
 */

class BookingMapperService {
  /**
   * Automatically detect event type from booking data
   * @param {Object} booking - Booking data from Rootments API
   * @returns {string} - 'booking' or 'rentout'
   */
  detectEventType(booking) {
    // Check status field
    if (booking.status) {
      const status = booking.status.toLowerCase();
      if (status.includes('rent') || status.includes('rentout') || status === 'rent out') {
        return 'rentout';
      }
      if (status.includes('book') || status === 'booked') {
        return 'booking';
      }
    }
    
    // Check if rentOutDate exists and is not null
    if (booking.rentOutDate && booking.rentOutDate !== null) {
      return 'rentout';
    }
    
    // Check if returnDate exists (indicates rentout)
    if (booking.returnDate && booking.returnDate !== null) {
      return 'rentout';
    }
    
    // Default to booking
    return 'booking';
  }

  /**
   * Automatically detect if discount exists
   * @param {Object} booking - Booking data from Rootments API
   * @returns {boolean} - true if discount exists
   */
  hasDiscount(booking) {
    // Check if discount field exists and is greater than 0
    if (booking.discount !== undefined && booking.discount !== null && parseFloat(booking.discount) > 0) {
      return true;
    }
    
    // Check if discountAmount field exists
    if (booking.discountAmount !== undefined && booking.discountAmount !== null && parseFloat(booking.discountAmount) > 0) {
      return true;
    }
    
    // Check if discountPercentage exists and is greater than 0
    if (booking.discountPercentage !== undefined && booking.discountPercentage !== null && parseFloat(booking.discountPercentage) > 0) {
      return true;
    }
    
    // Check if there's a difference between total and payable
    if (booking.totalAmount && booking.payableAmount) {
      const total = parseFloat(booking.totalAmount);
      const payable = parseFloat(booking.payableAmount);
      if (total > payable && (total - payable) > 0) {
        return true;
      }
    }
    
    // Check if price and finalPrice are different
    if (booking.price && booking.finalPrice) {
      const price = parseFloat(booking.price);
      const finalPrice = parseFloat(booking.finalPrice);
      if (price > finalPrice && (price - finalPrice) > 0) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Calculate discount amount
   * @param {Object} booking - Booking data from Rootments API
   * @param {number} totalAmount - Total amount
   * @param {number} payableAmount - Payable amount
   * @returns {number} - Discount amount
   */
  calculateDiscount(booking, totalAmount, payableAmount) {
    // If discount field exists, use it
    if (booking.discount !== undefined && booking.discount !== null) {
      return parseFloat(booking.discount);
    }
    
    // If discountAmount field exists, use it
    if (booking.discountAmount !== undefined && booking.discountAmount !== null) {
      return parseFloat(booking.discountAmount);
    }
    
    // Calculate from total and payable
    const total = parseFloat(totalAmount);
    const payable = parseFloat(payableAmount);
    if (total > payable) {
      return total - payable;
    }
    
    // Calculate from price and finalPrice
    if (booking.price && booking.finalPrice) {
      const price = parseFloat(booking.price);
      const finalPrice = parseFloat(booking.finalPrice);
      if (price > finalPrice) {
        return price - finalPrice;
      }
    }
    
    return 0;
  }

  /**
   * Format phone number (add country code if missing)
   * @param {string} phone - Phone number
   * @returns {string} - Formatted phone number with country code
   */
  formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Remove any spaces, dashes, or plus signs
    let formatted = phone.toString().replace(/[\s\-+]/g, '');
    
    // If it's 10 digits, add India country code (91)
    if (formatted.length === 10 && !formatted.startsWith('91')) {
      formatted = '91' + formatted;
    }
    
    return formatted;
  }

  /**
   * Map Rootments API booking data to WhatsApp API format
   * Automatically selects correct template based on data
   * @param {Object} booking - Booking data from Rootments API
   * @param {Object} options - Additional options
   * @param {string} options.phoneNumber - Override phone number
   * @param {string} options.brand - Brand name (default: 'suitorguy')
   * @returns {Object} - WhatsApp API payload
   */
  mapToWhatsApp(booking, options = {}) {
    // Detect event type and template type
    const eventType = this.detectEventType(booking);
    const hasDisc = this.hasDiscount(booking);
    const templateType = hasDisc ? 'withdiscount' : 'nodisc';
    
    // Get amounts
    const totalAmount = booking.price || booking.totalAmount || booking.amount || 0;
    const payableAmount = booking.finalPrice || booking.payableAmount || booking.price || totalAmount;
    const discountAmount = this.calculateDiscount(booking, totalAmount, payableAmount);
    const advancePaid = booking.advancePaid || booking.advance || booking.paidAmount || 0;
    const balanceDue = parseFloat(payableAmount) - parseFloat(advancePaid);
    
    // Format phone number
    const customerPhone = options.phoneNumber || this.formatPhoneNumber(booking.phoneNo || booking.phone || booking.customerPhone);
    
    // Build payload
    const payload = {
      brand: options.brand || 'suitorguy',
      event_type: eventType,
      template_type: templateType,
      customer_name: booking.customerName || booking.customer_name || 'Customer',
      customer_phone: customerPhone,
      booking_number: booking.bookingNo || booking.bookingNumber || booking.booking_no || 'UNKNOWN',
      total_amount: String(totalAmount),
      discount_amount: String(discountAmount),
      payable_amount: String(payableAmount),
      advance_paid: String(advancePaid),
      balance_due: String(Math.max(0, balanceDue))
    };
    
    // Add rentout-specific fields
    if (eventType === 'rentout') {
      payload.invoice_amount = String(payableAmount);
      payload.security_deposit = String(booking.securityDeposit || booking.security_deposit || 0);
      payload.security_amount = String(booking.securityAmount || booking.security_amount || booking.securityDeposit || booking.security_deposit || 0);
      payload.subtotal = String(totalAmount);
    }
    
    return {
      payload,
      detected: {
        eventType,
        templateType,
        hasDiscount: hasDisc,
        templateName: this.getTemplateName(eventType, templateType)
      }
    };
  }

  /**
   * Get template name based on event and template type
   * @param {string} eventType - 'booking' or 'rentout'
   * @param {string} templateType - 'withdiscount' or 'nodisc'
   * @returns {string} - Template name
   */
  getTemplateName(eventType, templateType) {
    const templates = {
      booking: {
        withdiscount: 'booking_summary_withdiscount',
        nodisc: 'booking_summary_nodisc'
      },
      rentout: {
        withdiscount: 'rentout_summary_withdiscount',
        nodisc: 'rentout_summary_nodisc'
      }
    };
    
    return templates[eventType]?.[templateType] || 'booking_summary_nodisc';
  }
}

module.exports = new BookingMapperService();
