const axios = require('axios');
const readline = require('readline');

const API_URL = 'http://localhost:5000/whatsapp/send';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask question
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Available test templates
const templates = {
  1: {
    name: 'SuitorGuy - Booking with Discount',
    payload: {
      brand: 'suitorguy',
      event_type: 'booking',
      template_type: 'withdiscount',
      customer_name: 'Test Customer',
      customer_phone: '', // Will be filled by user
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
      customer_phone: '', // Will be filled by user
      booking_number: `BK${Date.now()}`,
      total_amount: '5000',
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
      customer_phone: '', // Will be filled by user
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
      customer_phone: '', // Will be filled by user
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

async function testRealTemplate() {
  console.log('\n🧪 WhatsApp Template Message Testing Tool\n');
  console.log('=' .repeat(50));
  
  // Display available templates
  console.log('\nAvailable Templates:');
  Object.keys(templates).forEach(key => {
    console.log(`  ${key}. ${templates[key].name}`);
  });
  
  // Get template choice
  const templateChoice = await askQuestion('\nSelect template (1-4): ');
  const selectedTemplate = templates[templateChoice];
  
  if (!selectedTemplate) {
    console.log('❌ Invalid template selection!');
    rl.close();
    return;
  }
  
  // Get phone number
  console.log('\n📱 Phone Number Format: Country code + number (e.g., 919876543210)');
  console.log('   Note: No + sign, just numbers');
  const phoneNumber = await askQuestion('Enter recipient phone number: ');
  
  if (!phoneNumber || phoneNumber.length < 10) {
    console.log('❌ Invalid phone number!');
    rl.close();
    return;
  }
  
  // Get customer name (optional)
  const customerName = await askQuestion('Enter customer name (or press Enter for "Test Customer"): ');
  
  // Update payload with user inputs
  selectedTemplate.payload.customer_phone = phoneNumber.trim();
  if (customerName.trim()) {
    selectedTemplate.payload.customer_name = customerName.trim();
  }
  
  console.log('\n🚀 Sending test message...');
  console.log(`   Template: ${selectedTemplate.name}`);
  console.log(`   Phone: ${phoneNumber}`);
  console.log(`   Customer: ${selectedTemplate.payload.customer_name}`);
  console.log(`   Booking: ${selectedTemplate.payload.booking_number}`);
  console.log('');
  
  try {
    const response = await axios.post(API_URL, selectedTemplate.payload);
    
    console.log('✅ SUCCESS! Message sent successfully\n');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('\n📱 Check your WhatsApp for the message!');
    
  } catch (error) {
    console.log('\n❌ FAILED to send message\n');
    
    if (error.response) {
      console.log('Error Response:', JSON.stringify(error.response.data, null, 2));
      console.log('Status:', error.response.status);
    } else if (error.request) {
      console.log('Error: No response from server');
      console.log('Make sure the server is running on http://localhost:5000');
    } else {
      console.log('Error:', error.message);
    }
  }
  
  rl.close();
}

// Check if server is running first
async function checkServer() {
  try {
    await axios.get('http://localhost:5000/');
    return true;
  } catch (error) {
    console.log('❌ Server is not running!');
    console.log('Please start the server first: npm run dev');
    return false;
  }
}

// Main execution
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testRealTemplate();
  }
  process.exit(0);
})();
