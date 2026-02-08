const axios = require('axios');

const API_URL = 'http://localhost:5000/whatsapp/send';

async function diagnoseIssue() {
  console.log('🔍 DIAGNOSING WHATSAPP ISSUE...\n');
  console.log('=' .repeat(60));

  // Test 1: Check if server is running
  console.log('\n✅ Test 1: Checking if server is running...');
  try {
    const healthCheck = await axios.get('http://localhost:5000/');
    console.log('✅ Server is running:', healthCheck.data);
  } catch (error) {
    console.log('❌ Server is NOT running!');
    console.log('   Run: npm run dev');
    return;
  }

  // Test 2: Check credentials
  console.log('\n✅ Test 2: Checking credentials...');
  console.log('Phone Number ID:', process.env.SUITORGUY_PHONE_NUMBER_ID || 'NOT SET');
  console.log('Access Token:', process.env.SUITORGUY_ACCESS_TOKEN ? 'SET (hidden)' : 'NOT SET');
  console.log('Business Phone:', process.env.SUITORGUY_BUSINESS_PHONE || 'NOT SET');

  // Test 3: Send a simple test message
  console.log('\n✅ Test 3: Sending test message...');
  
  const payload = {
    brand: 'suitorguy',
    event_type: 'booking',
    template_type: 'withdiscount',
    customer_name: 'Test User',
    customer_phone: '918590292642',
    booking_number: `DIAG_${Date.now()}`,
    total_amount: '5000',
    discount_amount: '500',
    payable_amount: '4500',
    advance_paid: '2000',
    balance_due: '2500'
  };

  console.log('\nPayload:');
  console.log(JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(API_URL, payload);
    console.log('\n✅ API Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('\n🎉 Message sent successfully!');
      console.log('Message ID:', response.data.data.messageId);
      console.log('\n📱 Check WhatsApp on: 8590292642');
      console.log('\n⚠️  IMPORTANT CHECKS:');
      console.log('1. Is the phone number registered with WhatsApp Business API?');
      console.log('2. Are the templates approved in Meta Business Manager?');
      console.log('3. Is the recipient number a valid WhatsApp number?');
      console.log('4. Check Meta Business Manager for delivery status');
    }
  } catch (error) {
    console.log('\n❌ API Error:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', JSON.stringify(error.response.data, null, 2));
      
      // Specific error messages
      if (error.response.data.error) {
        const errorMsg = error.response.data.error;
        
        console.log('\n🔍 DIAGNOSIS:');
        
        if (errorMsg.includes('Invalid OAuth access token')) {
          console.log('❌ ACCESS TOKEN IS INVALID OR EXPIRED');
          console.log('   Solution:');
          console.log('   1. Go to Meta Business Manager');
          console.log('   2. Generate a new access token');
          console.log('   3. Update SUITORGUY_ACCESS_TOKEN in .env');
        }
        
        if (errorMsg.includes('template')) {
          console.log('❌ TEMPLATE NOT FOUND OR NOT APPROVED');
          console.log('   Solution:');
          console.log('   1. Go to Meta Business Manager');
          console.log('   2. Check if template "booking_summary_withdiscount" exists');
          console.log('   3. Check if template is approved');
          console.log('   4. Template name must match exactly');
        }
        
        if (errorMsg.includes('phone number')) {
          console.log('❌ PHONE NUMBER ISSUE');
          console.log('   Solution:');
          console.log('   1. Check if sender phone is registered in WhatsApp Business API');
          console.log('   2. Check if recipient number is valid WhatsApp number');
          console.log('   3. Format: 918590292642 (country code + number, no +)');
        }
        
        if (errorMsg.includes('parameter')) {
          console.log('❌ TEMPLATE PARAMETER MISMATCH');
          console.log('   Solution:');
          console.log('   1. Check template has correct number of variables');
          console.log('   2. Template expects 9 variables for booking_summary_withdiscount');
        }
      }
    } else {
      console.log('Network Error:', error.message);
    }
  }

  console.log('\n' + '=' .repeat(60));
  console.log('\n📋 CHECKLIST:');
  console.log('□ Server running (npm run dev)');
  console.log('□ WhatsApp Business API account set up');
  console.log('□ Phone number registered in Meta Business Manager');
  console.log('□ Templates created and approved');
  console.log('□ Access token is valid (not expired)');
  console.log('□ Phone Number ID is correct');
  console.log('□ Recipient has WhatsApp installed');
  console.log('□ Recipient number is correct format');
}

diagnoseIssue();
