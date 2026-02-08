# PDF Template Guide (pdf_test_template)

## 📄 What is pdf_test_template?

This is a WhatsApp template that includes a PDF document in the message header. The PDF appears directly in the message, not as a separate follow-up.

---

## 🎯 How to Use

### API Request:
```json
POST /whatsapp/send
{
  "brand": "suitorguy",
  "event_type": "pdf_test",
  "template_type": "default",
  "customer_phone": "918590292642",
  "booking_number": "BK12345",
  "pdf_url": "https://your-server.com/invoices/BK12345.pdf"
}
```

### What Happens:
1. WhatsApp sends the `pdf_test_template` message
2. PDF appears in the message header
3. Customer can view/download the PDF directly

---

## 🔧 Template Setup in Meta Business Manager

### 1. Create Template
Go to Meta Business Manager → WhatsApp Manager → Message Templates

### 2. Template Structure:
```
Template Name: pdf_test_template
Category: UTILITY
Language: English

Header: 
  Type: DOCUMENT
  (This will be replaced with your PDF)

Body:
  Your invoice is ready! Please find the attached document.

Footer (optional):
  Thank you for your business!

Buttons (optional):
  None
```

### 3. Submit for Approval
- Submit the template
- Wait for Meta approval (usually 24-48 hours)
- Once approved, you can use it

---

## 🧪 Testing

### Test 1: Basic Test
```bash
node test-pdf-template.js
```

### Test 2: With Your Own PDF
```javascript
// In test-pdf-template.js, uncomment:
await testWithCustomPDF('https://your-server.com/invoice.pdf', '918590292642');
```

---

## 📋 Requirements

### PDF URL Must Be:
- ✅ Publicly accessible (HTTPS)
- ✅ Direct link to PDF file
- ✅ Valid PDF format
- ✅ Under 100 MB

### Good URLs:
```
https://your-server.com/invoices/BK12345.pdf
https://storage.googleapis.com/bucket/invoice.pdf
https://s3.amazonaws.com/bucket/invoice.pdf
```

### Bad URLs:
```
http://localhost/invoice.pdf          ❌ Not HTTPS
https://site.com/download?id=123      ❌ Not direct link
file:///C:/invoices/invoice.pdf       ❌ Local file
```

---

## 🔄 Comparison: PDF Template vs Separate PDF

### Option 1: PDF Template (pdf_test_template)
```json
{
  "event_type": "pdf_test",
  "pdf_url": "https://..."
}
```
**Result:** 1 message with PDF in header

### Option 2: Template + Separate PDF
```json
{
  "event_type": "booking",
  "template_type": "withdiscount",
  "pdf_url": "https://..."
}
```
**Result:** 1 template message + 1 PDF message (2 messages)

### Option 3: PDF Only
```json
POST /pdf/send
{
  "pdf_url": "https://..."
}
```
**Result:** 1 PDF message only

---

## 🎨 Use Cases

### Use Case 1: Simple Invoice Delivery
```javascript
// Just send invoice, no details needed
{
  "brand": "suitorguy",
  "event_type": "pdf_test",
  "template_type": "default",
  "customer_phone": "918590292642",
  "booking_number": "BK12345",
  "pdf_url": "https://your-server.com/invoices/BK12345.pdf"
}
```

### Use Case 2: Booking Confirmation + Invoice
```javascript
// Send booking details + PDF
{
  "brand": "suitorguy",
  "event_type": "booking",
  "template_type": "withdiscount",
  "customer_phone": "918590292642",
  "booking_number": "BK12345",
  // ... booking details ...
  "pdf_url": "https://your-server.com/invoices/BK12345.pdf"
}
```

---

## 🔧 Integration with Technowave

### Scenario 1: Generate PDF, Send with Template
```javascript
// In Technowave:

// 1. Generate PDF
const pdfUrl = await generateInvoicePDF(bookingData);

// 2. Send via pdf_test_template
await fetch('https://your-backend.com/whatsapp/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    brand: "suitorguy",
    event_type: "pdf_test",
    template_type: "default",
    customer_phone: bookingData.customer_phone,
    booking_number: bookingData.booking_number,
    pdf_url: pdfUrl
  })
});
```

### Scenario 2: Booking Details + PDF
```javascript
// Send detailed booking info with PDF
await fetch('https://your-backend.com/whatsapp/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    brand: "suitorguy",
    event_type: "booking",
    template_type: "withdiscount",
    customer_phone: bookingData.customer_phone,
    booking_number: bookingData.booking_number,
    total_amount: "5000",
    discount_amount: "500",
    payable_amount: "4500",
    advance_paid: "2000",
    balance_due: "2500",
    pdf_url: pdfUrl  // PDF will be sent after template
  })
});
```

---

## 🐛 Troubleshooting

### Error: "Template not found"
**Solution:** Make sure `pdf_test_template` is approved in Meta Business Manager

### Error: "Invalid media URL"
**Solution:** 
- Check PDF URL is publicly accessible
- Must be HTTPS, not HTTP
- Must be direct link to PDF file

### Error: "Media download failed"
**Solution:**
- PDF might be too large (max 100 MB)
- URL might require authentication
- Server might be blocking WhatsApp's download request

### PDF Not Showing in Message
**Solution:**
- Check template has DOCUMENT header type
- Verify PDF URL is correct
- Check WhatsApp API logs for errors

---

## 📊 API Response

### Success:
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

### Error:
```json
{
  "success": false,
  "message": "Failed to send WhatsApp message",
  "error": "Template not found"
}
```

---

## ✅ Checklist

Before using pdf_test_template:

- [ ] Template created in Meta Business Manager
- [ ] Template approved by Meta
- [ ] Template name is exactly "pdf_test_template"
- [ ] Template has DOCUMENT header type
- [ ] PDF is uploaded to public server
- [ ] PDF URL is HTTPS
- [ ] PDF is under 100 MB
- [ ] Tested with sample PDF
- [ ] Tested with real invoice PDF

---

## 🎉 Summary

**What You Can Do:**
- ✅ Send PDF in template message header
- ✅ Simpler than sending separate PDF
- ✅ Professional appearance
- ✅ One message instead of two

**What You Need:**
- ✅ Approved `pdf_test_template` in Meta
- ✅ Publicly accessible PDF URL (HTTPS)
- ✅ Valid WhatsApp Business API credentials

**Next Steps:**
1. Create and approve template in Meta Business Manager
2. Upload PDFs to public server
3. Test with `node test-pdf-template.js`
4. Integrate with Technowave

🚀 You're ready to send PDFs via template!
