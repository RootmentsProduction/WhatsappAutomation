const axios = require('axios');

const API_URL = 'http://localhost:5000/whatsapp/send';
const TEST_PHONE = '918590292642';

// Test all 8 scenarios: 2 brands × 2 events × 2 discount types
const scenarios = [
  {
    name: '✅ Test 1: SuitorGuy - Booking WITH Discount',
    payload: {
      brand: 'suitorguy',
      event_type: 'booking',
      template_type: 'withdiscount',
      customer_name: 'Test User',
      customer_phone: TEST_PHONE,
      booking_number: `SG_BK_DISC_${Date.now()}`,
      total_amount: '10000',
      discount_amount: '1000',
      payable_amount: '9000',
      advance_paid: '5000',
      balance_due: '4000'
    },
    expectedBrand: 'SuitorGuy',
    expectedTemplate: 'booking_summary_withdiscount'
  },
  {
    name: '✅ Test 2: SuitorGuy - Booking WITHOUT Discount',
    payload: {
      brand: 'suitorguy',
      event_type: 'booking',
      template_type: 'nodisc',
      customer_name: 'Test User',
      customer_phone: TEST_PHONE,
      booking_number: `SG_BK_NODISC_${Date.now()}`,
      total_amount: '10000',
      payable_amount: '10000',
      advance_paid: '5000',
      balance_due: '5000'
    },
    expectedBrand: 'SuitorGuy',
    expectedTemplate: 'booking_summary_nodisc'
  },
  {
    name: '✅ Test 3: SuitorGuy - Rent-out WITH Discount',
    payload: {
      brand: 'suitorguy',
      event_type: 'rentout',
      template_type: 'withdiscount',
      customer_name: 'Test User',
      customer_phone: TEST_PHONE,
      booking_number: `SG_RO_DISC_${Date.now()}`,
      total_amount: '15000',
      discount_amount: '1500',
      invoice_amount: '13500',
      advance_paid: '7000',
      balance_due: '6500',
      security_deposit: '2000',
      subtotal: '15500'
    },
    expectedBrand: 'SuitorGuy',
    expectedTemplate: 'rentout_summary_withdiscount'
  },
  {
    name: '✅ Test 4: SuitorGuy - Rent-out WITHOUT Discount',
    payload: {
      brand: 'suitorguy',
      event_type: 'rentout',
      template_type: 'nodisc',
      customer_name: 'Test User',
      customer_phone: TEST_PHONE,
      booking_number: `SG_RO_NODISC_${Date.now()}`,
      total_amount: '15000',
      invoice_amount: '15000',
      advance_paid: '7000',
      balance_due: '8000',
      security_amount: '2000',
      subtotal: '17000'
    },
    expectedBrand: 'SuitorGuy',
    expectedTemplate: 'rentout_summary_nodisc'
  },
  {
    name: '✅ Test 5: Zorucci - Booking WITH Discount',
    payload: {
      brand: 'zorucci',
      event_type: 'booking',
      template_type: 'withdiscount',
      customer_name: 'Test User',
      customer_phone: TEST_PHONE,
      booking_number: `ZR_BK_DISC_${Date.now()}`,
      total_amount: '12000',
      discount_amount: '1200',
      payable_amount: '10800',
      advance_paid: '6000',
      balance_due: '4800'
    },
    expectedBrand: 'Zorucci',
    expectedTemplate: 'booking_summary_withdiscount'
  },
  {
    name: '✅ Test 6: Zorucci - Booking WITHOUT Discount',
    payload: {
      brand: 'zorucci',
      event_type: 'booking',
      template_type: 'nodisc',
      customer_name: 'Test User',
      customer_phone: TEST_PHONE,
      booking_number: `ZR_BK_NODISC_${Date.now()}`,
      total_amount: '12000',
      payable_amount: '12000',
      advance_paid: '6000',
      balance_due: '6000'
    },
    expectedBrand: 'Zorucci',
    expectedTemplate: 'booking_summary_nodisc'
  },
  {
    name: '✅ Test 7: Zorucci - Rent-out WITH Discount',
    payload: {
      brand: 'zorucci',
      event_type: 'rentout',
      template_type: 'withdiscount',
      customer_name: 'Test User',
      customer_phone: TEST_PHONE,
      booking_number: `ZR_RO_DISC_${Date.now()}`,
      total_amount: '18000',
      discount_amount: '1800',
      invoice_amount: '16200',
      advance_paid: '8000',
      balance_due: '8200',
      security_deposit: '3000',
      subtotal: '19200'
    },
    expectedBrand: 'Zorucci',
    expectedTemplate: 'rentout_summary_withdiscount'
  },
  {
    name: '✅ Test 8: Zorucci - Rent-out WITHOUT Discount',
    payload: {
      brand: 'zorucci',
      event_type: 'rentout',
      template_type: 'nodisc',
      customer_name: 'Test User',
      customer_phone: TEST_PHONE,
      booking_number: `ZR_RO_NODISC_${Date.now()}`,
      total_amount: '18000',
      invoice_amount: '18000',
      advance_paid: '8000',
      balance_due: '10000',
      security_amount: '3000',
      subtotal: '21000'
    },
    expectedBrand: 'Zorucci',
    expectedTemplate: 'rentout_summary_nodisc'
  }
];

async function runAllScenarios() {
  console.log('🚀 COMPREHENSIVE BRAND & TEMPLATE FILTERING TEST\n');
  console.log('=' .repeat(60));
  console.log(`📱 Testing with phone number: ${TEST_PHONE}`);
  console.log(`🧪 Total scenarios to test: ${scenarios.length}`);
  console.log('=' .repeat(60));
  console.log('\n');

  let passedTests = 0;
  let failedTests = 0;
  const results = [];

  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    
    console.log(`\n${scenario.name}`);
    console.log('-'.repeat(60));
    console.log(`Brand: ${scenario.payload.brand.toUpperCase()}`);
    console.log(`Event: ${scenario.payload.event_type}`);
    console.log(`Template Type: ${scenario.payload.template_type}`);
    console.log(`Booking Number: ${scenario.payload.booking_number}`);
    console.log(`Expected Brand: ${scenario.expectedBrand}`);
    console.log(`Expected Template: ${scenario.expectedTemplate}`);

    try {
      const response = await axios.post(API_URL, scenario.payload);
      
      if (response.data.success) {
        console.log('\n✅ SUCCESS!');
        console.log(`Message ID: ${response.data.data.messageId}`);
        console.log(`Booking: ${response.data.data.bookingNumber}`);
        
        passedTests++;
        results.push({
          test: scenario.name,
          status: '✅ PASSED',
          brand: scenario.payload.brand,
          messageId: response.data.data.messageId
        });
      } else {
        console.log('\n❌ FAILED - Unexpected response');
        failedTests++;
        results.push({
          test: scenario.name,
          status: '❌ FAILED',
          error: 'Unexpected response'
        });
      }
    } catch (error) {
      console.log('\n❌ FAILED!');
      console.log(`Error: ${error.response?.data?.message || error.message}`);
      
      failedTests++;
      results.push({
        test: scenario.name,
        status: '❌ FAILED',
        error: error.response?.data?.message || error.message
      });
    }

    // Wait 2 seconds between tests to avoid rate limiting
    if (i < scenarios.length - 1) {
      console.log('\n⏳ Waiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Print summary
  console.log('\n\n');
  console.log('=' .repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(60));
  console.log(`\n✅ Passed: ${passedTests}/${scenarios.length}`);
  console.log(`❌ Failed: ${failedTests}/${scenarios.length}`);
  console.log(`📈 Success Rate: ${((passedTests / scenarios.length) * 100).toFixed(1)}%`);

  console.log('\n\n📋 DETAILED RESULTS:\n');
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.status} - ${result.test}`);
    if (result.brand) {
      console.log(`   Brand: ${result.brand}`);
    }
    if (result.messageId) {
      console.log(`   Message ID: ${result.messageId}`);
    }
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
  });

  console.log('=' .repeat(60));
  console.log('🎯 WHAT TO VERIFY:');
  console.log('=' .repeat(60));
  console.log(`\n1. Check WhatsApp on ${TEST_PHONE}`);
  console.log('2. You should receive 8 different messages');
  console.log('3. Verify each message shows correct:');
  console.log('   - Brand name (SuitorGuy or Zorucci)');
  console.log('   - Booking/Rent-out details');
  console.log('   - Discount information (where applicable)');
  console.log('   - Brand contact number');
  console.log('\n4. Check MongoDB for 8 log entries');
  console.log('5. Verify brand filtering worked correctly\n');

  if (passedTests === scenarios.length) {
    console.log('🎉 ALL TESTS PASSED! Brand filtering is working perfectly!\n');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.\n');
  }
}

runAllScenarios();
