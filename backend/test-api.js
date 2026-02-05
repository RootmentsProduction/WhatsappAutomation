const axios = require('axios');

const API_URL = 'http://localhost:5000/whatsapp/send';

// Test payloads
const tests = [
  {
    name: 'SuitorGuy - Booking with Discount',
    payload: {
      brand: 'suitorguy',
      event_type: 'booking',
      template_type: 'withdiscount',
      customer_name: 'John Doe',
      customer_phone: '918590292642',
      booking_number: 'BK101',
      total_amount: '5000',
      discount_amount: '500',
      payable_amount: '4500',
      advance_paid: '2000',
      balance_due: '2500'
    }
  },
  {
    name: 'SuitorGuy - Booking without Discount',
    payload: {
      brand: 'suitorguy',
      event_type: 'booking',
      template_type: 'nodisc',
      customer_name: 'Jane Smith',
      customer_phone: '919876543211',
      booking_number: 'BK102',
      total_amount: '5000',
      payable_amount: '5000',
      advance_paid: '2000',
      balance_due: '3000'
    }
  },
  {
    name: 'Zorucci - Rent-out with Discount',
    payload: {
      brand: 'zorucci',
      event_type: 'rentout',
      template_type: 'withdiscount',
      customer_name: 'Mike Johnson',
      customer_phone: '919876543212',
      booking_number: 'RO101',
      total_amount: '8000',
      discount_amount: '800',
      invoice_amount: '7200',
      advance_paid: '3000',
      balance_due: '4200',
      security_deposit: '1000',
      subtotal: '8200'
    }
  },
  {
    name: 'Zorucci - Rent-out without Discount',
    payload: {
      brand: 'zorucci',
      event_type: 'rentout',
      template_type: 'nodisc',
      customer_name: 'Sarah Williams',
      customer_phone: '919876543213',
      booking_number: 'RO102',
      total_amount: '8000',
      invoice_amount: '8000',
      advance_paid: '3000',
      balance_due: '5000',
      security_amount: '1000',
      subtotal: '9000'
    }
  }
];

async function runTests() {
  console.log('🚀 Starting API Tests...\n');

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const response = await axios.post(API_URL, test.payload);
      console.log('✅ Success:', response.data);
      console.log('---\n');
    } catch (error) {
      console.log('❌ Failed:', error.response?.data || error.message);
      console.log('---\n');
    }
  }

  console.log('✨ Tests completed!');
}

runTests();
