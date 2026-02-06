const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

const templatesConfig = require('./config/templates.config');
const whatsappConfig = require('./config/whatsapp.config');

/**
 * Debug script to see exactly what variables are being sent
 */

const testPayload = {
  brand: 'suitorguy',
  event_type: 'booking',
  template_type: 'nodisc',
  customer_name: 'ASHWIN TOM',
  customer_phone: '918590292642',
  booking_number: 'TEST123',
  total_amount: '11399',
  discount_amount: '0',
  payable_amount: '11399',
  advance_paid: '0',
  balance_due: '11399'
};

const template = templatesConfig.booking.nodisc;
const brandConfig = whatsappConfig.suitorguy;

// Calculate discount percentage
const totalAmount = parseFloat(testPayload.total_amount || 0);
const discountAmount = parseFloat(testPayload.discount_amount || 0);
const discountPercentage = totalAmount > 0 ? Math.round((discountAmount / totalAmount) * 100) : 0;

const mapping = {
  customer_name: testPayload.customer_name,
  booking_number: testPayload.booking_number,
  total_amount: testPayload.total_amount,
  discount_amount: testPayload.discount_amount || '0',
  discount_percentage: String(discountPercentage),
  payable_amount: testPayload.payable_amount,
  advance_paid: testPayload.advance_paid,
  balance_due: testPayload.balance_due,
  brand_name: brandConfig.displayName,
  brand_contact: brandConfig.businessPhone
};

console.log('\n🔍 Template Variable Mapping Debug\n');
console.log('=' .repeat(60));
console.log('\n📋 Template: booking_summary_nodisc');
console.log(`   Variables count: ${template.variables.length}`);
console.log('\n📤 Variables being sent (in order):\n');

template.variables.forEach((varName, index) => {
  const value = mapping[varName] || '';
  console.log(`   {{${index + 1}}} ${varName.padEnd(20)} = "${value}"`);
});

console.log('\n📊 Expected vs Actual:\n');
console.log('   Based on your message:');
console.log('   - Total: ₹11399 ✓ (position 3)');
console.log('   - Discount (0%): ₹11399 ✗ (should be ₹0)');
console.log('     → Position 4 (discount_percentage) = 0 ✓');
console.log('     → Position 5 (discount_amount) = 11399 ✗ (should be 0)');
console.log('   - Payable Amount: ₹0 ✗ (should be ₹11399)');
console.log('     → Position 6 (payable_amount) = 0 ✗ (should be 11399)');
console.log('   - Advance Paid: ₹11399 ✗ (should be ₹0)');
console.log('     → Position 7 (advance_paid) = 11399 ✗ (should be 0)');
console.log('   - Balance Due: ₹SuitorGuy ✗ (should be ₹11399)');
console.log('     → Position 8 (balance_due) = SuitorGuy ✗ (should be 11399)');

console.log('\n💡 The issue: Variables are shifted!');
console.log('   Position 5 is getting total_amount instead of discount_amount');
console.log('   This suggests the template might expect a different structure.');
