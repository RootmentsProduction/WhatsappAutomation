const axios = require('axios');

/**
 * Simple test script for real template messages
 * 
 * Usage:
 *   node test-simple.js <phone_number> [template_number]
 * 
 * Examples:
 *   node test-simple.js 919876543210 1
 *   node test-simple.js 919876543210
 * 
 * Template Numbers:
 *   1 = SuitorGuy Booking with Discount
 *   2 = SuitorGuy Booking without Discount
 *   3 = Zorucci Rent-out with Discount
 *   4 = Zorucci Rent-out without Discount
 */

const API_URL = 'http://localhost:5000/whatsapp/send';

const templates = {
  1: {
    name: 'SuitorGuy - Booking with Discount',
    payload: {
      brand: 'suitorguy',
      event_type: 'booking',
      template_type: 'withdiscount',
      customer_name: 'Test Customer',
      customer_phone: '',
      booking_number: `BK${Date.now()}`,
      total_amount: '5000',
      discount_amount: '500',
      payable_amount: '4500',
      advance_paid: '2000',
      balance_due: '2500'
    }
  },
  2: {
    name: 'SuitorGuy - Booking without Discount',
    payload: {
      brand: 'suitorguy',
      event_type: 'booking',
      template_type: 'nodisc',
      customer_name: 'Test Customer',
      customer_phone: '',
      booking_number: `BK${Date.now()}`,
      total_amount: '5000',
      discount_amount: '0',  // Added - template needs this even if 0
      payable_amount: '5000',
      advance_paid: '2000',
      balance_due: '3000'
    }
  },
  3: {
    name: 'Zorucci - Rent-out with Discount',
    payload: {
      brand: 'zorucci',
      event_type: 'rentout',
      template_type: 'withdiscount',
      customer_name: 'Test Customer',
      customer_phone: '',
      booking_number: `RO${Date.now()}`,
      total_amount: '8000',
      discount_amount: '800',
      invoice_amount: '7200',
      advance_paid: '3000',
      balance_due: '4200',
      security_deposit: '1000',
      subtotal: '8200'
    }
  },
  4: {
    name: 'Zorucci - Rent-out without Discount',
    payload: {
      brand: 'zorucci',
      event_type: 'rentout',
      template_type: 'nodisc',
      customer_name: 'Test Customer',
      customer_phone: '',
      booking_number: `RO${Date.now()}`,
      total_amount: '8000',
      invoice_amount: '8000',
      advance_paid: '3000',
      balance_due: '5000',
      security_amount: '1000',
      subtotal: '9000'
    }
  }
};

async function testTemplate(phoneNumber, templateNumber = 1) {
  const template = templates[templateNumber];
  
  if (!template) {
    console.error('❌ Invalid template number. Use 1-4');
    console.log('\nAvailable templates:');
    Object.keys(templates).forEach(key => {
      console.log(`  ${key}. ${templates[key].name}`);
    });
    process.exit(1);
  }
  
  if (!phoneNumber || phoneNumber.length < 10) {
    console.error('❌ Invalid phone number!');
    console.log('Format: Country code + number (e.g., 919876543210)');
    process.exit(1);
  }
  
  template.payload.customer_phone = phoneNumber.trim();
  
  console.log('\n🧪 Testing Real Template Message');
  console.log('=' .repeat(50));
  console.log(`Template: ${template.name}`);
  console.log(`Phone: ${phoneNumber}`);
  console.log(`Booking: ${template.payload.booking_number}`);
  console.log('\n🚀 Sending...\n');
  
  try {
    const response = await axios.post(API_URL, template.payload);
    
    console.log('✅ SUCCESS! Message sent successfully\n');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('\n📱 Check your WhatsApp for the message!');
    
  } catch (error) {
    console.log('❌ FAILED to send message\n');
    
    if (error.response) {
      console.log('Error:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('Error: Server not running. Start with: npm run dev');
    } else {
      console.log('Error:', error.message);
    }
    process.exit(1);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
const phoneNumber = args[0];
const templateNumber = args[1] ? parseInt(args[1]) : 1;

if (!phoneNumber) {
  console.log('Usage: node test-simple.js <phone_number> [template_number]');
  console.log('\nExample: node test-simple.js 919876543210 1');
  console.log('\nAvailable templates:');
  Object.keys(templates).forEach(key => {
    console.log(`  ${key}. ${templates[key].name}`);
  });
  process.exit(1);
}

testTemplate(phoneNumber, templateNumber);
