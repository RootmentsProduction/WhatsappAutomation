const axios = require('axios');

/**
 * Test script using sample booking data from Rootments API
 * This tests if your WhatsApp API works with real booking data structure
 * 
 * Usage:
 *   node test-with-sample-booking.js [phone_number]
 * 
 * Example:
 *   node test-with-sample-booking.js 918590292642
 */

const WHATSAPP_API_URL = 'http://localhost:5000/whatsapp/send';

// Sample booking data from your Rootments API
const sampleBooking = {
  "bookingNo": `TEST${Date.now()}`,
  "itemCode": "lhb10925za40428mjd",
  "itemName": "VOILET LEHANGA -SUMAN-1",
  "customerName": "ASHWIN TOM",
  "phoneNo": "7994095027",
  "paymentType": null,
  "location": "Z- Edapally",
  "status": "Booked",
  "bookingBy": "ANEETHA AZEEZ",
  "measurement": "670",
  "address": "VYPIN\n8848106325",
  "remarks": "EDITED ADDED MEASUREMENT ",
  "bookingDate": "2025-12-16T05:12:05",
  "deliveryDate": "2026-01-10T00:00:00",
  "rentOutDate": "2026-01-10T00:00:00",
  "expectedReturnDate": "2026-01-14T00:00:00",
  "trialDate": null,
  "returnDate": "2026-01-13T00:00:00",
  "cancelDate": null,
  "category": "GARMENT B1",
  "subCategory": "LEHANGA",
  "price": 11399.000
};

const bookingMapper = require('./services/booking-mapper.service');

async function testWithSampleBooking(phoneNumber = null) {
  console.log('🧪 Testing WhatsApp API with Sample Rootments Booking Data\n');
  console.log('=' .repeat(60));
  
  console.log('\n📋 Sample Booking Data:');
  console.log(`   Booking No: ${sampleBooking.bookingNo}`);
  console.log(`   Customer: ${sampleBooking.customerName}`);
  console.log(`   Phone: ${sampleBooking.phoneNo}`);
  console.log(`   Status: ${sampleBooking.status}`);
  console.log(`   Price: ₹${sampleBooking.price}`);
  console.log(`   Item: ${sampleBooking.itemName}`);
  
  // Map to WhatsApp format (automatically detects template)
  const result = bookingMapper.mapToWhatsApp(sampleBooking, { phoneNumber: phoneNumber });
  const whatsappPayload = result.payload;
  
  console.log('\n🔍 Auto-Detected:');
  console.log(`   Event Type: ${result.detected.eventType}`);
  console.log(`   Template Type: ${result.detected.templateType}`);
  console.log(`   Has Discount: ${result.detected.hasDiscount ? 'Yes' : 'No'}`);
  console.log(`   Template Name: ${result.detected.templateName}`);
  
  console.log('\n📤 WhatsApp API Payload:');
  console.log(JSON.stringify(whatsappPayload, null, 2));
  
  try {
    console.log('\n🚀 Sending WhatsApp message...\n');
    
    const response = await axios.post(WHATSAPP_API_URL, whatsappPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ SUCCESS! WhatsApp message sent!\n');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('\n📱 Check WhatsApp for the message!');
    console.log(`   Phone: ${whatsappPayload.customer_phone}`);
    console.log(`   Booking: ${whatsappPayload.booking_number}`);
    
  } catch (error) {
    console.log('\n❌ FAILED to send message\n');
    
    if (error.response) {
      console.log('Error Response:', JSON.stringify(error.response.data, null, 2));
      console.log('Status:', error.response.status);
    } else if (error.request) {
      console.log('Error: Server not running');
      console.log('💡 Start server with: npm run dev');
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Get phone number from command line
const phoneNumber = process.argv[2] || null;

if (phoneNumber) {
  console.log(`\n📱 Using phone number: ${phoneNumber}`);
  console.log('   (Will override phone from booking data)\n');
}

testWithSampleBooking(phoneNumber);
