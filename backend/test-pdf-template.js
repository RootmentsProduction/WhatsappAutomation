const axios = require('axios');

const API_URL = 'http://localhost:5000/whatsapp/send';

// Test PDF template from Meta
async function testPDFTemplate() {
  console.log('🚀 Testing PDF Template (pdf_test_template)...\n');

  const payload = {
    brand: 'suitorguy',
    event_type: 'pdf_test',
    template_type: 'default',
    customer_phone: '917559816891',
    booking_number: `PDF_TEST_${Date.now()}`,
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  };

  try {
    console.log('📱 Sending to:', payload.customer_phone);
    console.log('📄 PDF URL:', payload.pdf_url);
    console.log('🎫 Booking Number:', payload.booking_number);
    console.log('🏷️  Template: pdf_test_template');
    
    const response = await axios.post(API_URL, payload);
    
    console.log('\n✅ SUCCESS!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('\n📱 Check WhatsApp for the message with PDF!');
    console.log('The PDF should appear in the message header.');
  } catch (error) {
    console.log('\n❌ FAILED!');
    console.log('Error:', error.response?.data || error.message);
    
    if (error.response?.data?.error?.includes('template')) {
      console.log('\n⚠️  Make sure "pdf_test_template" is approved in Meta Business Manager');
      console.log('Template should have:');
      console.log('  - Header: Document type');
      console.log('  - Body: Your message text');
    }
  }
}

// Test with custom PDF URL
async function testWithCustomPDF(pdfUrl, phone = '917559816891') {
  console.log('\n\n🚀 Testing with Custom PDF...\n');

  const payload = {
    brand: 'suitorguy',
    event_type: 'pdf_test',
    template_type: 'default',
    customer_phone: phone,
    booking_number: `CUSTOM_PDF_${Date.now()}`,
    pdf_url: pdfUrl
  };

  try {
    console.log('📱 Sending to:', payload.customer_phone);
    console.log('📄 PDF URL:', payload.pdf_url);
    
    const response = await axios.post(API_URL, payload);
    
    console.log('\n✅ SUCCESS!');
    console.log('Message ID:', response.data.data.messageId);
  } catch (error) {
    console.log('\n❌ FAILED!');
    console.log('Error:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  // Test 1: With sample PDF
  await testPDFTemplate();
  
  // Uncomment to test with your own PDF URL
  // await testWithCustomPDF('https://your-server.com/invoice.pdf', '918590292642');
}

runTests();
