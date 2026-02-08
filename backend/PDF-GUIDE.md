# PDF Sending Guide

## 📄 How to Send PDFs via WhatsApp

Your backend now supports sending PDF documents to customers!

---

## 🎯 Option 1: Send PDF with Template Message

Include `pdf_url` in your regular booking/rent-out request:

```json
POST /whatsapp/send
{
  "brand": "suitorguy",
  "event_type": "booking",
  "template_type": "withdiscount",
  "customer_name": "John Doe",
  "customer_phone": "918590292642",
  "booking_number": "BK12345",
  "total_amount": "5000",
  "discount_amount": "500",
  "payable_amount": "4500",
  "advance_paid": "2000",
  "balance_due": "2500",
  "pdf_url": "https://your-server.com/invoices/BK12345.pdf"
}
```

**What happens:**
1. Template message is sent first
2. PDF is sent immediately after
3. If PDF fails, template message still succeeds

---

## 🎯 Option 2: Send PDF Only

Use the dedicated PDF endpoint:

```json
POST /pdf/send
{
  "brand": "suitorguy",
  "customer_phone": "918590292642",
  "pdf_url": "https://your-server.com/invoices/BK12345.pdf",
  "booking_number": "BK12345",
  "caption": "Your booking invoice is attached"
}
```

---

## 📋 Requirements

### 1. PDF Must Be Publicly Accessible
The PDF URL must be:
- ✅ Publicly accessible (no authentication required)
- ✅ HTTPS (not HTTP)
- ✅ Direct link to PDF file
- ✅ Valid PDF format

**Good URLs:**
```
https://your-server.com/invoices/BK12345.pdf
https://storage.googleapis.com/bucket/invoice.pdf
https://s3.amazonaws.com/bucket/invoice.pdf
```

**Bad URLs:**
```
http://localhost/invoice.pdf          ❌ Not HTTPS
https://site.com/download?id=123      ❌ Not direct link
https://private-server.com/file.pdf   ❌ Requires authentication
```

### 2. File Size Limits
- Maximum file size: **100 MB**
- Recommended: Keep under **5 MB** for faster delivery

### 3. Supported Formats
- PDF (.pdf)
- Word (.doc, .docx)
- Excel (.xls, .xlsx)
- PowerPoint (.ppt, .pptx)
- Text (.txt)

---

## 🧪 Testing

### Test with Sample PDF:
```bash
node test-pdf.js
```

This sends a test PDF to verify everything works.

### Test with Your Own PDF:

1. Upload your PDF to a public server
2. Get the direct URL
3. Update `test-pdf.js` with your URL
4. Run the test

---

## 🔧 Integration with Technowave

### Scenario 1: Generate PDF, Then Send
```javascript
// In Technowave system:

// 1. Generate PDF invoice
const pdfUrl = await generateInvoicePDF(bookingData);
// Returns: "https://your-server.com/invoices/BK12345.pdf"

// 2. Send WhatsApp notification with PDF
await fetch('https://your-backend.com/whatsapp/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    brand: "suitorguy",
    event_type: "booking",
    template_type: "withdiscount",
    customer_phone: "918590292642",
    booking_number: "BK12345",
    // ... other fields
    pdf_url: pdfUrl  // Add PDF URL
  })
});
```

### Scenario 2: Send PDF Later
```javascript
// Send template message first
await sendWhatsAppNotification(bookingData);

// Generate and send PDF later
const pdfUrl = await generateInvoicePDF(bookingData);

await fetch('https://your-backend.com/pdf/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    brand: "suitorguy",
    customer_phone: "918590292642",
    pdf_url: pdfUrl,
    booking_number: "BK12345",
    caption: "Your invoice is ready"
  })
});
```

---

## 📊 How It Works

### Flow Diagram:
```
Technowave
    ↓
Generate PDF → Upload to Server → Get Public URL
    ↓
Send to Backend API
    ↓
Backend validates URL
    ↓
WhatsApp API downloads PDF
    ↓
Customer receives PDF on WhatsApp
```

### Important Notes:
1. **WhatsApp downloads the PDF** from your URL
2. The PDF must be accessible when WhatsApp tries to download it
3. Keep PDFs hosted for at least 24 hours after sending
4. Use a CDN or cloud storage (AWS S3, Google Cloud Storage) for reliability

---

## 🎨 PDF Storage Options

### Option 1: AWS S3 (Recommended)
```javascript
// Upload to S3, get public URL
const s3Url = await uploadToS3(pdfBuffer, 'invoices/BK12345.pdf');
// Returns: https://bucket.s3.amazonaws.com/invoices/BK12345.pdf
```

### Option 2: Google Cloud Storage
```javascript
const gcsUrl = await uploadToGCS(pdfBuffer, 'invoices/BK12345.pdf');
// Returns: https://storage.googleapis.com/bucket/invoices/BK12345.pdf
```

### Option 3: Your Own Server
```javascript
// Save to public folder
fs.writeFileSync('/var/www/html/invoices/BK12345.pdf', pdfBuffer);
// URL: https://your-domain.com/invoices/BK12345.pdf
```

---

## 🔒 Security Considerations

### Option 1: Temporary URLs (Recommended)
Generate signed URLs that expire:
```javascript
// AWS S3 signed URL (expires in 1 hour)
const signedUrl = s3.getSignedUrl('getObject', {
  Bucket: 'invoices',
  Key: 'BK12345.pdf',
  Expires: 3600
});
```

### Option 2: Random Filenames
Use UUIDs instead of booking numbers:
```javascript
const filename = `${uuid()}.pdf`;
// invoice-a7b3c9d2-4e5f-6g7h-8i9j-0k1l2m3n4o5p.pdf
```

---

## 📝 API Response Examples

### Success Response:
```json
{
  "success": true,
  "message": "WhatsApp message sent successfully",
  "data": {
    "success": true,
    "messageId": "wamid.HBgLOTE4NTkwMjkyNjQyFQIAERgSMzQxRjE3...",
    "bookingNumber": "BK12345"
  }
}
```

### Error Response (Invalid PDF URL):
```json
{
  "success": false,
  "message": "Failed to send WhatsApp message",
  "error": "Invalid media URL"
}
```

---

## 🐛 Troubleshooting

### PDF Not Received?

**Check 1: Is URL accessible?**
```bash
curl -I https://your-server.com/invoices/BK12345.pdf
# Should return: HTTP/2 200
```

**Check 2: Is it HTTPS?**
- WhatsApp requires HTTPS, not HTTP

**Check 3: Is it a direct link?**
- URL should end with `.pdf`
- No redirects or authentication

**Check 4: File size?**
- Must be under 100 MB

**Check 5: Check server logs**
- Look for "Failed to send PDF" errors

---

## 📚 Complete Example

```javascript
// Complete flow from Technowave

async function sendBookingConfirmation(bookingData) {
  try {
    // 1. Generate PDF invoice
    const pdfBuffer = await generateInvoicePDF(bookingData);
    
    // 2. Upload to S3
    const pdfUrl = await uploadToS3(
      pdfBuffer, 
      `invoices/${bookingData.booking_number}.pdf`
    );
    
    // 3. Send WhatsApp notification with PDF
    const response = await fetch('https://your-backend.com/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brand: bookingData.brand,
        event_type: 'booking',
        template_type: bookingData.discount > 0 ? 'withdiscount' : 'nodisc',
        customer_name: bookingData.customer_name,
        customer_phone: bookingData.customer_phone,
        booking_number: bookingData.booking_number,
        total_amount: bookingData.total_amount,
        discount_amount: bookingData.discount_amount,
        payable_amount: bookingData.payable_amount,
        advance_paid: bookingData.advance_paid,
        balance_due: bookingData.balance_due,
        pdf_url: pdfUrl  // Include PDF URL
      })
    });
    
    const result = await response.json();
    console.log('WhatsApp sent:', result);
    
    return result;
  } catch (error) {
    console.error('Failed to send booking confirmation:', error);
    throw error;
  }
}
```

---

## ✅ Summary

**What You Can Do:**
- ✅ Send PDF with template message
- ✅ Send PDF separately
- ✅ Send invoices, receipts, contracts
- ✅ Automatic filename and caption
- ✅ Brand-specific sending

**What You Need:**
- ✅ Publicly accessible PDF URL (HTTPS)
- ✅ PDF under 100 MB
- ✅ Valid WhatsApp Business API credentials

**Next Steps:**
1. Set up PDF storage (S3, GCS, or your server)
2. Generate PDFs in Technowave
3. Upload and get public URL
4. Include `pdf_url` in API request
5. Test with `node test-pdf.js`

🎉 You're ready to send PDFs via WhatsApp!
