const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

const bookingMapper = require('./services/booking-mapper.service');

/**
 * Test script to fetch booking data from Rootments API and send WhatsApp messages
 * 
 * Usage:
 *   node test-with-booking-api.js [booking_number] [phone_number]
 * 
 * Examples:
 *   node test-with-booking-api.js 202512160010001 918590292642
 *   node test-with-booking-api.js
 */

const BOOKING_API_URL = 'https://rentalapi.rootments.live/api/Reports/GetBookingReport';
const WHATSAPP_API_URL = 'http://localhost:5000/whatsapp/send';

// Use booking mapper service for automatic template selection

async function fetchBookingData(bookingNumber = null) {
  try {
    console.log('\n📡 Fetching booking data from Rootments API...\n');
    
    // You may need to add authentication headers here
    const response = await axios.post(BOOKING_API_URL, {
      // Add request body if needed by the API
      // bookingNo: bookingNumber
    }, {
      headers: {
        'Content-Type': 'application/json'
        // Add authorization headers if needed
        // 'Authorization': 'Bearer YOUR_TOKEN'
      }
    });
    
    if (response.data && response.data.dataSet && response.data.dataSet.data) {
      const bookings = response.data.dataSet.data;
      
      if (bookingNumber) {
        // Find specific booking
        const booking = bookings.find(b => b.bookingNo === bookingNumber);
        if (booking) {
          return booking;
        } else {
          console.log(`⚠️  Booking ${bookingNumber} not found`);
          return bookings[0]; // Return first booking as fallback
        }
      }
      
      // Return first booking if no specific booking requested
      if (bookings.length > 0) {
        return bookings[0];
      }
    }
    
    throw new Error('No booking data found in API response');
    
  } catch (error) {
    console.error('❌ Error fetching booking data:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

async function sendWhatsAppMessage(payload) {
  try {
    console.log('\n📤 Sending WhatsApp message...\n');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    const response = await axios.post(WHATSAPP_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

async function testWithBookingAPI(bookingNumber = null, phoneNumber = null) {
  console.log('🧪 Testing WhatsApp API with Rootments Booking Data\n');
  console.log('=' .repeat(60));
  
  try {
    // Step 1: Fetch booking data
    const bookingData = await fetchBookingData(bookingNumber);
    
    console.log('✅ Booking data fetched:');
    console.log(`   Booking No: ${bookingData.bookingNo}`);
    console.log(`   Customer: ${bookingData.customerName}`);
    console.log(`   Phone: ${bookingData.phoneNo}`);
    console.log(`   Status: ${bookingData.status}`);
    console.log(`   Price: ₹${bookingData.price}`);
    
    // Step 2: Map to WhatsApp API format (automatically detects template)
    const result = bookingMapper.mapToWhatsApp(bookingData, { phoneNumber: phoneNumber });
    const whatsappPayload = result.payload;
    
    console.log('\n🔍 Auto-Detected:');
    console.log(`   Event Type: ${result.detected.eventType}`);
    console.log(`   Template Type: ${result.detected.templateType}`);
    console.log(`   Has Discount: ${result.detected.hasDiscount ? 'Yes' : 'No'}`);
    console.log(`   Template Name: ${result.detected.templateName}`);
    console.log(`   Customer Phone: ${whatsappPayload.customer_phone}`);
    
    // Step 3: Send WhatsApp message
    const result = await sendWhatsAppMessage(whatsappPayload);
    
    console.log('\n✅ SUCCESS! WhatsApp message sent!');
    console.log('\nResponse:', JSON.stringify(result, null, 2));
    console.log('\n📱 Check WhatsApp for the message!');
    
  } catch (error) {
    console.log('\n❌ FAILED!');
    console.log('Error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Make sure your WhatsApp API server is running:');
      console.log('   npm run dev');
    }
  }
}

// Get command line arguments
const bookingNumber = process.argv[2] || null;
const phoneNumber = process.argv[3] || null;

if (bookingNumber) {
  console.log(`\n🔍 Testing with booking number: ${bookingNumber}`);
}
if (phoneNumber) {
  console.log(`📱 Using phone number: ${phoneNumber}`);
}

testWithBookingAPI(bookingNumber, phoneNumber);
