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
        'customer_name',
        'booking_number',
        'total_amount',
        'payable_amount',
        'advance_paid',
        'balance_due',
        'brand_name',
        'brand_contact'
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
  },
  pdf_test: {
    default: {
      name: 'pdf_test_template',
      variables: [],
      hasPdfHeader: true
    }
  }
};
