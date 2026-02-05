const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables FIRST
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

const whatsappConfig = require('./config/whatsapp.config');
const templatesConfig = require('./config/templates.config');

/**
 * Test script to check what variables your Meta template expects
 * This will try different variable counts to find the right one
 */

async function testTemplateVariables(brand = 'suitorguy', eventType = 'booking', templateType = 'nodisc') {
  const brandConfig = whatsappConfig[brand];
  const template = templatesConfig[eventType]?.[templateType];
  
  if (!brandConfig || !template) {
    console.error('❌ Invalid brand or template');
    process.exit(1);
  }
  
  console.log(`\n🔍 Testing Template: ${template.name}`);
  console.log(`   Brand: ${brandConfig.displayName}`);
  console.log(`   Current config has ${template.variables.length} variables`);
  console.log('=' .repeat(60));
  
  // Try sending with current config first
  const testPhone = '918590292642';
  const testVariables = template.variables.map((varName, index) => {
    const mapping = {
      customer_name: 'Test Customer',
      booking_number: 'TEST123',
      total_amount: '5000',
      discount_amount: '0',
      payable_amount: '5000',
      invoice_amount: '5000',
      advance_paid: '2000',
      balance_due: '3000',
      security_deposit: '1000',
      security_amount: '1000',
      subtotal: '6000',
      brand_name: brandConfig.displayName,
      brand_contact: brandConfig.businessPhone || 'N/A'
    };
    return mapping[varName] || `Test${index + 1}`;
  });
  
  console.log(`\n📤 Trying to send with ${template.variables.length} variables...`);
  console.log(`Variables being sent:`);
  template.variables.forEach((name, index) => {
    console.log(`   ${index + 1}. ${name} = ${testVariables[index]}`);
  });
  
  const url = `https://graph.facebook.com/v18.0/${brandConfig.phoneNumberId}/messages`;
  
  const payload = {
    messaging_product: 'whatsapp',
    to: testPhone,
    type: 'template',
    template: {
      name: template.name,
      language: {
        code: 'en'
      },
      components: [
        {
          type: 'body',
          parameters: testVariables.map(value => ({
            type: 'text',
            text: String(value)
          }))
        }
      ]
    }
  };
  
  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${brandConfig.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`\n✅ SUCCESS! Message sent with ${template.variables.length} variables!`);
    console.log(`Message ID: ${response.data.messages[0].id}`);
    console.log(`\n📱 Check your WhatsApp (${testPhone}) for the message!`);
    
  } catch (error) {
    if (error.response) {
      const errorData = error.response.data;
      console.log(`\n❌ Error: ${JSON.stringify(errorData, null, 2)}`);
      
      if (errorData.error?.message?.includes('Number of parameters')) {
        console.log(`\n💡 The template expects a DIFFERENT number of variables!`);
        console.log(`\n📝 To fix this:`);
        console.log(`1. Go to Meta Business Manager`);
        console.log(`2. Open your template "${template.name}"`);
        console.log(`3. Count how many {{1}}, {{2}}, {{3}}, etc. are in the template`);
        console.log(`4. Update config/templates.config.js to match that count`);
        console.log(`\nCurrent config has: ${template.variables.length} variables`);
        console.log(`Your Meta template might need a different number.`);
      }
    } else {
      console.log(`\n❌ Error: ${error.message}`);
    }
  }
}

// Get arguments
const brand = process.argv[2] || 'suitorguy';
const eventType = process.argv[3] || 'booking';
const templateType = process.argv[4] || 'nodisc';

testTemplateVariables(brand, eventType, templateType);
