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
      name: 'bookingsummary',
      variables: [
        'customer_name',
        'booking_number',
        'total_amount',
        'discount_amount',
        'payable_amount',
        'advance_paid',
        'balance_due',
        'brand_name',
        'brand_contact',
        'brand_contact'  // If template needs 10, might be duplicate or another field
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
