const axios = require('axios');

const API_URL = 'http://localhost:5000/pdf/send';

// Test sending PDF
async function testPDFSend() {
  console.log('🚀 Testing PDF Send...\n');

  const payload = {
    brand: 'suitorguy',
    customer_phone: '918590292642',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Sample PDF
    booking_number: `TEST_PDF_${Date.now()}`,
    caption: 'Your booking invoice is attached'
  };

  try {
    console.log('Sending PDF to:', payload.customer_phone);
    console.log('PDF URL:', payload.pdf_url);
    console.log('Booking Number:', payload.booking_number);
    
    const response = await axios.post(API_URL, payload);
    
    console.log('\n✅ SUCCESS!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('\n📱 Check WhatsApp for the PDF!');
  } catch (error) {
    console.log('\n❌ FAILED!');
    console.log('Error:', error.response?.data || error.message);
  }
}

testPDFSend();
