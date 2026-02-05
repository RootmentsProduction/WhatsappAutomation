const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables FIRST, before requiring config
const envPath = path.join(__dirname, '.env');
const result = dotenv.config({ path: envPath });

// Now require the config after env is loaded
const whatsappConfig = require('./config/whatsapp.config');

// Debug: Check if .env file exists and what was loaded
if (!fs.existsSync(envPath)) {
  console.log('⚠️  Warning: .env file not found at:', envPath);
} else {
  console.log('✅ .env file found');
  
  // Debug: Show what was parsed
  if (result.error) {
    console.log('❌ Error loading .env:', result.error.message);
  } else {
    console.log('✅ .env file loaded successfully');
    // Show raw values (first few chars only for security)
    console.log('\n🔍 Debug - Environment variables loaded:');
    console.log('   SUITORGUY_PHONE_NUMBER_ID:', process.env.SUITORGUY_PHONE_NUMBER_ID ? '✅ Set (' + process.env.SUITORGUY_PHONE_NUMBER_ID.substring(0, 10) + '...)' : '❌ Not set');
    console.log('   SUITORGUY_ACCESS_TOKEN:', process.env.SUITORGUY_ACCESS_TOKEN ? '✅ Set (' + process.env.SUITORGUY_ACCESS_TOKEN.substring(0, 20) + '...)' : '❌ Not set');
    console.log('   SUITORGUY_BUSINESS_PHONE:', process.env.SUITORGUY_BUSINESS_PHONE ? '✅ Set (' + process.env.SUITORGUY_BUSINESS_PHONE + ')' : '❌ Not set');
  }
}

/**
 * Script to check if WhatsApp credentials are properly configured
 * 
 * Usage:
 *   node check-credentials.js [brand]
 */

function checkCredentials(brand = 'suitorguy') {
  console.log(`\n🔐 Checking Credentials for ${brand.toUpperCase()}\n`);
  console.log('=' .repeat(60));
  
  const brandConfig = whatsappConfig[brand];
  
  if (!brandConfig) {
    console.error(`❌ Invalid brand: ${brand}`);
    console.log('Available brands: suitorguy, zorucci');
    process.exit(1);
  }
  
  // Check Phone Number ID
  const phoneNumberId = brandConfig.phoneNumberId;
  console.log('\n📱 Phone Number ID:');
  if (phoneNumberId) {
    console.log(`   ✅ Found: ${phoneNumberId}`);
  } else {
    console.log(`   ❌ Missing!`);
    console.log(`   💡 Set ${brand.toUpperCase()}_PHONE_NUMBER_ID in .env file`);
  }
  
  // Check Access Token
  const accessToken = brandConfig.accessToken;
  console.log('\n🔑 Access Token:');
  if (accessToken) {
    // Check if it looks valid (starts with EAA or similar)
    const tokenPreview = accessToken.substring(0, 20) + '...';
    console.log(`   ✅ Found: ${tokenPreview}`);
    
    // Check token format
    if (accessToken.length < 50) {
      console.log(`   ⚠️  Warning: Token seems too short (${accessToken.length} chars)`);
      console.log(`   💡 Access tokens are usually 200+ characters long`);
    }
    
    // Check if token is expired (basic check - can't fully verify without API call)
    if (accessToken.includes('expired') || accessToken.includes('invalid')) {
      console.log(`   ⚠️  Warning: Token might be invalid`);
    }
  } else {
    console.log(`   ❌ Missing!`);
    console.log(`   💡 Set ${brand.toUpperCase()}_ACCESS_TOKEN in .env file`);
  }
  
  // Check Business Phone
  const businessPhone = brandConfig.businessPhone;
  console.log('\n📞 Business Phone:');
  if (businessPhone) {
    console.log(`   ✅ Found: ${businessPhone}`);
  } else {
    console.log(`   ⚠️  Optional: Not set`);
    console.log(`   💡 Set ${brand.toUpperCase()}_BUSINESS_PHONE in .env file`);
  }
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  if (phoneNumberId && accessToken) {
    console.log('\n✅ Credentials are set!');
    console.log('\n💡 If you still get "Invalid OAuth access token" error:');
    console.log('   1. Token might be expired - generate a new one');
    console.log('   2. Token might have wrong permissions');
    console.log('   3. Check token in Meta Business Manager');
    console.log('\n📚 How to get/refresh access token:');
    console.log('   1. Go to Meta Business Manager');
    console.log('   2. Navigate to WhatsApp > API Setup');
    console.log('   3. Copy the Access Token');
    console.log('   4. Update .env file');
  } else {
    console.log('\n❌ Missing required credentials!');
    console.log('\n📝 Required in .env file:');
    console.log(`   ${brand.toUpperCase()}_PHONE_NUMBER_ID=your_phone_number_id`);
    console.log(`   ${brand.toUpperCase()}_ACCESS_TOKEN=your_access_token`);
    console.log('\n💡 Optional:');
    console.log(`   ${brand.toUpperCase()}_BUSINESS_PHONE=your_business_phone`);
  }
  
  console.log('');
}

// Get brand from command line
const brand = process.argv[2] || 'suitorguy';
checkCredentials(brand);
