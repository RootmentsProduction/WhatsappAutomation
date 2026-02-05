const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables FIRST, before requiring config
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

// Now require config after env is loaded
const whatsappConfig = require('./config/whatsapp.config');

/**
 * Script to list all approved WhatsApp templates from Meta Business Manager
 * 
 * Usage:
 *   node list-meta-templates.js [brand]
 * 
 * Examples:
 *   node list-meta-templates.js suitorguy
 *   node list-meta-templates.js zorucci
 */

async function listTemplates(brand = 'suitorguy') {
  const brandConfig = whatsappConfig[brand];
  
  if (!brandConfig) {
    console.error(`❌ Invalid brand: ${brand}`);
    console.log('Available brands: suitorguy, zorucci');
    process.exit(1);
  }

  if (!brandConfig.phoneNumberId || !brandConfig.accessToken) {
    console.error(`❌ Missing credentials for ${brand}`);
    console.log('Please check your .env file for:');
    console.log(`  - ${brand.toUpperCase()}_PHONE_NUMBER_ID`);
    console.log(`  - ${brand.toUpperCase()}_ACCESS_TOKEN`);
    process.exit(1);
  }

  const url = `https://graph.facebook.com/v18.0/${brandConfig.phoneNumberId}/message_templates`;

  console.log(`\n📋 Fetching WhatsApp Templates for ${brandConfig.displayName}...\n`);
  console.log('=' .repeat(60));

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${brandConfig.accessToken}`
      },
      params: {
        limit: 100
      }
    });

    const templates = response.data.data || [];

    if (templates.length === 0) {
      console.log('⚠️  No templates found for this brand.');
      console.log('\nMake sure:');
      console.log('1. Templates are approved in Meta Business Manager');
      console.log('2. Phone Number ID is correct');
      console.log('3. Access Token has proper permissions');
      return;
    }

    console.log(`\n✅ Found ${templates.length} template(s):\n`);

    templates.forEach((template, index) => {
      console.log(`${index + 1}. Template Name: ${template.name}`);
      console.log(`   Status: ${template.status}`);
      console.log(`   Language: ${template.language || 'N/A'}`);
      
      // Show components (body variables)
      if (template.components) {
        const bodyComponent = template.components.find(c => c.type === 'BODY');
        if (bodyComponent && bodyComponent.text) {
          console.log(`   Body Preview: ${bodyComponent.text.substring(0, 100)}...`);
        }
        
        // Count variables
        const variableCount = template.components
          .filter(c => c.type === 'BODY')
          .reduce((count, c) => count + (c.example?.body_text?.length || 0), 0);
        
        if (variableCount > 0) {
          console.log(`   Variables: ${variableCount} placeholder(s)`);
        }
      }
      
      console.log(`   Category: ${template.category || 'N/A'}`);
      console.log('');
    });

    console.log('=' .repeat(60));
    console.log('\n📝 To use a template in your config:');
    console.log('1. Copy the exact template name (e.g., "booking_summary_withdiscount")');
    console.log('2. Update config/templates.config.js with that name');
    console.log('3. Make sure the variable count matches your template');
    console.log('\n💡 Example:');
    console.log('   In templates.config.js, change:');
    console.log('   name: \'booking_summary_withdiscount\'');
    console.log('   to your Meta template name\n');

  } catch (error) {
    console.error('\n❌ Error fetching templates:\n');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.log('\n💡 This usually means:');
        console.log('   - Access token is expired or invalid');
        console.log('   - Token doesn\'t have WhatsApp Business API permissions');
      } else if (error.response.status === 404) {
        console.log('\n💡 This usually means:');
        console.log('   - Phone Number ID is incorrect');
        console.log('   - Check your .env file');
      }
    } else if (error.request) {
      console.error('No response from Meta API');
      console.log('Check your internet connection');
    } else {
      console.error('Error:', error.message);
    }
    
    process.exit(1);
  }
}

// Get brand from command line or default to suitorguy
const brand = process.argv[2] || 'suitorguy';

listTemplates(brand);
