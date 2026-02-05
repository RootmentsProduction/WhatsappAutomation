const axios = require('axios');

const API_URL = 'http://localhost:5000/whatsapp/send';

// Generate unique booking numbers with timestamp
const timestamp = Date.now();

// Test payloads with unique booking numbers
const tests = [
  {
    name: 'SuitorGuy - Booking with Discount',
    payload: {
      brand: 'suitorguy',
      event_type: 'booking',
      template_type: 'withdiscount',
      customer_name: 'John Doe',
      customer_phone: '918943300095',
      booking_number: `BK${timestamp}1`,
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
      customer_phone: '918943300095',
      booking_number: `BK${timestamp}2`,
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
      customer_phone: '918590292642',
      booking_number: `RO${timestamp}1`,
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
      customer_phone: '918590292642',
      booking_number: `RO${timestamp}2`,
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
  console.log('🚀 Starting Fresh API Tests...\n');
  console.log(`📝 Using timestamp: ${timestamp}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`Booking Number: ${test.payload.booking_number}`);
      
      const response = await axios.post(API_URL, test.payload);
      
      console.log('✅ Success!');
      console.log('Response:', JSON.stringify(response.data, null, 2));
      console.log('---\n');
      successCount++;
    } catch (error) {
      console.log('❌ Failed!');
      console.log('Error:', error.response?.data || error.message);
      console.log('---\n');
      failCount++;
    }
  }

  console.log('✨ Tests completed!');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
}

runTests();
