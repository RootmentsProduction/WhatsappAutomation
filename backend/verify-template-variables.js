const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables FIRST, before requiring config
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

// Now require configs after env is loaded
const whatsappConfig = require('./config/whatsapp.config');
const templatesConfig = require('./config/templates.config');

/**
 * Script to verify template variables match between config and Meta template
 * 
 * Usage:
 *   node verify-template-variables.js [brand] [event_type] [template_type]
 * 
 * Examples:
 *   node verify-template-variables.js suitorguy booking nodisc
 *   node verify-template-variables.js suitorguy booking withdiscount
 */

async function verifyTemplate(brand = 'suitorguy', eventType = 'booking', templateType = 'nodisc') {
  const brandConfig = whatsappConfig[brand];
  const template = templatesConfig[eventType]?.[templateType];
  
  if (!brandConfig) {
    console.error(`❌ Invalid brand: ${brand}`);
    process.exit(1);
  }
  
  if (!template) {
    console.error(`❌ Invalid template: ${eventType}/${templateType}`);
    process.exit(1);
  }
  
  console.log(`\n🔍 Verifying Template: ${template.name}`);
  console.log(`   Brand: ${brandConfig.displayName}`);
  console.log(`   Type: ${eventType} - ${templateType}`);
  console.log('=' .repeat(60));
  
  // Fetch template from Meta
  const url = `https://graph.facebook.com/v18.0/${brandConfig.phoneNumberId}/message_templates`;
  
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${brandConfig.accessToken}`
      },
      params: {
        name: template.name,
        limit: 1
      }
    });
    
    const metaTemplates = response.data.data || [];
    
    if (metaTemplates.length === 0) {
      console.log(`\n❌ Template "${template.name}" not found in Meta!`);
      console.log('\nPossible issues:');
      console.log('1. Template name doesn\'t match exactly (case-sensitive)');
      console.log('2. Template is not approved');
      console.log('3. Template is in a different WhatsApp Business Account');
      console.log('\n💡 Run: node list-meta-templates.js ' + brand);
      process.exit(1);
    }
    
    const metaTemplate = metaTemplates[0];
    
    console.log(`\n✅ Template found in Meta!`);
    console.log(`   Status: ${metaTemplate.status}`);
    console.log(`   Category: ${metaTemplate.category || 'N/A'}`);
    
    // Check body component for variables
    const bodyComponent = metaTemplate.components?.find(c => c.type === 'BODY');
    
    if (!bodyComponent) {
      console.log('\n⚠️  No body component found in template');
      return;
    }
    
    // Count variables in Meta template
    const bodyText = bodyComponent.text || '';
    const variableMatches = bodyText.match(/\{\{(\d+)\}\}/g) || [];
    const metaVariableCount = variableMatches.length;
    
    // Count variables in config
    const configVariableCount = template.variables.length;
    
    console.log(`\n📊 Variable Comparison:`);
    console.log(`   Meta Template Variables: ${metaVariableCount}`);
    console.log(`   Config Variables: ${configVariableCount}`);
    
    if (metaVariableCount !== configVariableCount) {
      console.log(`\n❌ MISMATCH! Variable count doesn't match!`);
      console.log(`\nMeta template has ${metaVariableCount} variables:`);
      variableMatches.forEach((match, index) => {
        console.log(`   ${match} (position ${index + 1})`);
      });
      console.log(`\nConfig has ${configVariableCount} variables:`);
      template.variables.forEach((varName, index) => {
        console.log(`   ${index + 1}. ${varName}`);
      });
      console.log(`\n💡 Update config/templates.config.js to match Meta template`);
    } else {
      console.log(`\n✅ Variable count matches!`);
      console.log(`\nVariable Mapping:`);
      template.variables.forEach((varName, index) => {
        console.log(`   {{${index + 1}}} → ${varName}`);
      });
    }
    
    // Show template preview
    console.log(`\n📝 Template Preview:`);
    console.log(`   ${bodyText.substring(0, 200)}...`);
    
    console.log(`\n✅ Verification complete!`);
    
  } catch (error) {
    console.error('\n❌ Error verifying template:\n');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    
    process.exit(1);
  }
}

// Get arguments
const brand = process.argv[2] || 'suitorguy';
const eventType = process.argv[3] || 'booking';
const templateType = process.argv[4] || 'nodisc';

verifyTemplate(brand, eventType, templateType);
