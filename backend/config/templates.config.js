module.exports = {
  booking: {
    withdiscount: {
      name: 'booking_summary_withdiscount',
      variables: [
        'customer_name',
        'booking_number',
        'total_amount',
        'discount_amount',
        'payable_amount',
        'advance_paid',
        'balance_due',
        'brand_name',
        'brand_contact'
      ]
    },
    nodisc: {
      name: 'booking_summary_nodisc',
      variables: [
        'customer_name',        // {{1}} - Customer name
        'booking_number',       // {{2}} - Booking number
        'total_amount',         // {{3}} - Total amount
        'discount_amount',      // {{4}} - Discount amount (0 if no discount)
        'payable_amount',       // {{5}} - Payable amount
        'advance_paid',         // {{6}} - Advance paid
        'balance_due',          // {{7}} - Balance due
        'brand_name'            // {{8}} - Brand name
        // Note: Template only needs 8 variables, not 10
      ]
    }
  },
  rentout: {
    withdiscount: {
      name: 'rentout_summary_withdiscount',
      variables: [
        'customer_name',
        'booking_number',
        'total_amount',
        'discount_amount',
        'invoice_amount',
        'advance_paid',
        'balance_due',
        'security_deposit',
        'subtotal',
        'brand_name',
        'brand_contact'
      ]
    },
    nodisc: {
      name: 'rentout_summary_nodisc',
      variables: [
        'customer_name',
        'booking_number',
        'total_amount',
        'invoice_amount',
        'advance_paid',
        'balance_due',
        'security_amount',
        'subtotal',
        'brand_name',
        'brand_contact'
      ]
    }
  }
};
