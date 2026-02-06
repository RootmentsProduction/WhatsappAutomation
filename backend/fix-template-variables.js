const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

const whatsappConfig = require('./config/whatsapp.config');
const templatesConfig = require('./config/templates.config');

/**
 * Script to test and verify template variable order
 * Based on the message received, we need to fix the variable order
 */

async function testTemplateVariables() {
  console.log('\n🔍 Analyzing Template Variable Order Issue\n');
  console.log('=' .repeat(60));
  
  // Based on the message received:
  // Balance Due is showing "SuitorGuy" instead of the amount
  // This means variables are in wrong order
  
  console.log('\n📋 Current Template Config (booking_summary_nodisc):');
  const template = templatesConfig.booking.nodisc;
  console.log('Variables:', template.variables);
  console.log('\nVariable Order:');
  template.variables.forEach((v, i) => {
    console.log(`  ${i + 1}. ${v}`);
  });
  
  console.log('\n❌ Issue Found:');
  console.log('   The template has 10 variables, but the order might be wrong.');
  console.log('   Balance Due is showing brand_name instead of balance_due amount.');
  
  console.log('\n💡 Based on your message, the template likely expects:');
  console.log('   1. customer_name');
  console.log('   2. booking_number');
  console.log('   3. total_amount');
  console.log('   4. discount_amount (or discount percentage)');
  console.log('   5. payable_amount');
  console.log('   6. advance_paid');
  console.log('   7. balance_due');
  console.log('   8. brand_name');
  console.log('   9. brand_contact');
  console.log('   10. (maybe another field or duplicate)');
  
  console.log('\n📝 Current order in config:');
  template.variables.forEach((v, i) => {
    console.log(`   ${i + 1}. ${v}`);
  });
}

testTemplateVariables();
