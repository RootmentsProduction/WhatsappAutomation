const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

const templatesConfig = require('./config/templates.config');
const whatsappConfig = require('./config/whatsapp.config');
const messageService = require('./services/message.service');

/**
 * Test script to verify exact variable mapping
 */

async function testVariableMapping() {
  console.log('\n🧪 Testing Variable Mapping\n');
  console.log('=' .repeat(60));
  
  const testPayload = {
    brand: 'suitorguy',
    event_type: 'booking',
    template_type: 'nodisc',
    customer_name: 'ASHWIN TOM',
    customer_phone: '918590292642',
    booking_number: `TEST${Date.now()}`,
    total_amount: '11399',
    discount_amount: '0',
    payable_amount: '11399',
    advance_paid: '0',
    balance_due: '11399'
  };
  
  const template = templatesConfig.booking.nodisc;
  const brandConfig = whatsappConfig.suitorguy;
  
  console.log('\n📋 Input Payload:');
  console.log(JSON.stringify(testPayload, null, 2));
  
  console.log('\n📤 Template Variables (in order):');
  template.variables.forEach((v, i) => {
    console.log(`   ${i + 1}. ${v}`);
  });
  
  // Map variables using the service
  const mappedVariables = messageService.mapVariables(testPayload, template.variables, brandConfig);
  
  console.log('\n🔍 Mapped Variables (what will be sent to WhatsApp):');
  mappedVariables.forEach((value, index) => {
    console.log(`   {{${index + 1}}} = "${value}"`);
  });
  
  console.log('\n📊 Expected Mapping:');
  console.log('   {{1}} = Customer Name → "ASHWIN TOM"');
  console.log('   {{2}} = Booking Number → "TEST..."');
  console.log('   {{3}} = Total Amount → "11399"');
  console.log('   {{4}} = Discount Amount → "0"');
  console.log('   {{5}} = Payable Amount → "11399"');
  console.log('   {{6}} = Advance Paid → "0"');
  console.log('   {{7}} = Balance Due → "11399"');
  console.log('   {{8}} = Brand Name → "SuitorGuy"');
  console.log('   {{9}} = Brand Contact → "8943300097"');
  console.log('   {{10}} = Brand Contact → "8943300097"');
  
  console.log('\n✅ Verification:');
  const checks = [
    { pos: 1, expected: 'ASHWIN TOM', actual: mappedVariables[0], field: 'customer_name' },
    { pos: 3, expected: '11399', actual: mappedVariables[2], field: 'total_amount' },
    { pos: 4, expected: '0', actual: mappedVariables[3], field: 'discount_amount' },
    { pos: 5, expected: '11399', actual: mappedVariables[4], field: 'payable_amount' },
    { pos: 7, expected: '11399', actual: mappedVariables[6], field: 'balance_due' },
    { pos: 8, expected: 'SuitorGuy', actual: mappedVariables[7], field: 'brand_name' }
  ];
  
  checks.forEach(check => {
    const match = check.actual === check.expected;
    console.log(`   Position ${check.pos} (${check.field}): ${match ? '✅' : '❌'} ${check.actual} ${match ? '' : `(expected: ${check.expected})`}`);
  });
  
  // Now test sending
  console.log('\n🚀 Testing actual send...\n');
  
  try {
    const result = await messageService.sendMessage(testPayload);
    console.log('✅ Message sent successfully!');
    console.log('   Message ID:', result.messageId);
    console.log('   Booking:', result.bookingNumber);
    console.log('\n📱 Check WhatsApp to verify the message content!');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testVariableMapping();
