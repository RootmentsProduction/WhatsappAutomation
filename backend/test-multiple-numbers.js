const axios = require('axios');

const API_URL = 'http://localhost:5000/whatsapp/send';

// 5 phone numbers to test
const phoneNumbers = [
  '917736737820',
  '919846578590',
  '918156957475',
  '917593838787',
  '917593838714'
];

async function testAllNumbers() {
  console.log('🚀 Testing with 5 different numbers...\n');
  
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < phoneNumbers.length; i++) {
    const phone = phoneNumbers[i];
    const timestamp = Date.now() + i; // Unique booking number for each
    
    const payload = {
      brand: 'suitorguy',
      event_type: 'booking',
      template_type: 'withdiscount',
      customer_name: `Test Customer ${i + 1}`,
      customer_phone: phone,
      booking_number: `TEST${timestamp}`,
      total_amount: '5000',
      discount_amount: '500',
      payable_amount: '4500',
      advance_paid: '2000',
      balance_due: '2500'
    };

    try {
      console.log(`\n📱 Testing number ${i + 1}/5: ${phone}`);
      console.log(`Booking Number: ${payload.booking_number}`);
      
      const response = await axios.post(API_URL, payload);
      
      console.log('✅ Success!');
      console.log('Message ID:', response.data.data.messageId);
      successCount++;
      
      // Wait 2 seconds between requests to avoid rate limiting
      if (i < phoneNumbers.length - 1) {
        console.log('⏳ Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.log('❌ Failed!');
      console.log('Error:', error.response?.data || error.message);
      failCount++;
    }
    
    console.log('---');
  }

  console.log('\n✨ All tests completed!');
  console.log(`✅ Successful: ${successCount}/5`);
  console.log(`❌ Failed: ${failCount}/5`);
  console.log('\n📱 Check these numbers for WhatsApp messages:');
  phoneNumbers.forEach((phone, i) => {
    console.log(`   ${i + 1}. ${phone}`);
  });
}

testAllNumbers();
