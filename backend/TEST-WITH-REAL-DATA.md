# Testing with Real Data

## 🎯 Quick Start

### Step 1: Start Your Server

```bash
cd "D:\AROOTMENTS\ROOTMENTS MAIN FILES\Whatsapp-Automation\backend"
npm run dev
```

Keep this terminal running!

---

### Step 2: Test with Real Rootments API Data

**Option A: Fetch Real Booking from Rootments API**

```bash
# Test with specific booking number
node test-with-booking-api.js 202512160010001 918590292642

# Test with first available booking
node test-with-booking-api.js
```

**What it does:**
- ✅ Fetches real booking data from Rootments API
- ✅ Automatically detects template (booking/rentout, with/without discount)
- ✅ Maps to WhatsApp format
- ✅ Sends WhatsApp message

**Option B: Test with Sample Booking Data**

```bash
# Test with sample booking (uses your real booking structure)
node test-with-sample-booking.js 918590292642
```

---

## 📋 Method 1: Using Real Rootments API

### Prerequisites

1. **Your Rootments API must be accessible**
   - URL: `https://rentalapi.rootments.live/api/Reports/GetBookingReport`
   - May need authentication (update script if needed)

2. **Server must be running**
   ```bash
   npm run dev
   ```

### Usage

```bash
# Test with specific booking number
node test-with-booking-api.js [booking_number] [phone_number]

# Examples:
node test-with-booking-api.js 202512160010001 918590292642
node test-with-booking-api.js 202512160010001
```

### What Happens

1. **Fetches booking data** from Rootments API
2. **Auto-detects:**
   - Event type (booking/rentout)
   - Template type (withdiscount/nodisc)
3. **Maps data** to WhatsApp format
4. **Sends WhatsApp message**
5. **Shows results**

### If API Needs Authentication

Edit `test-with-booking-api.js` and add authentication:

```javascript
const response = await axios.post(BOOKING_API_URL, {
  // Add request body if needed
}, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'  // Add if needed
  }
});
```

---

## 📋 Method 2: Using Sample Booking Data

### Usage

```bash
node test-with-sample-booking.js [phone_number]

# Example:
node test-with-sample-booking.js 918590292642
```

### What It Does

- Uses sample booking data (matches your Rootments API structure)
- Automatically detects template
- Sends WhatsApp message
- Good for quick testing without API access

### Customize Sample Data

Edit `test-with-sample-booking.js` and update the `sampleBooking` object with your real booking data.

---

## 📋 Method 3: Using Postman/Thunder Client

### Step 1: Get Real Booking Data

1. Call your Rootments API to get booking data
2. Copy the booking JSON

### Step 2: Map to WhatsApp Format

Use the booking mapper service or manually create payload:

```json
{
  "brand": "suitorguy",
  "event_type": "booking",
  "template_type": "nodisc",
  "customer_name": "Real Customer Name",
  "customer_phone": "918590292642",
  "booking_number": "202512160010001",
  "total_amount": "11399",
  "discount_amount": "0",
  "payable_amount": "11399",
  "advance_paid": "0",
  "balance_due": "11399"
}
```

### Step 3: Send to WhatsApp API

**Using Postman:**
1. POST to `http://localhost:5000/whatsapp/send`
2. Body: JSON (use the payload above)
3. Send

**Using Thunder Client (VS Code):**
1. Open `test.http`
2. Update the JSON with real data
3. Click "Send Request"

---

## 📋 Method 4: Direct API Integration

### From Your Booking System

When a booking is created in your system, call the WhatsApp API:

```javascript
// Example: After creating booking in Rootments
const bookingData = {
  bookingNo: "202512160010001",
  customerName: "ASHWIN TOM",
  phoneNo: "7994095027",
  status: "Booked",
  price: 11399,
  // ... other fields
};

// Map to WhatsApp format
const bookingMapper = require('./services/booking-mapper.service');
const result = bookingMapper.mapToWhatsApp(bookingData);

// Send WhatsApp message
const response = await axios.post('http://localhost:5000/whatsapp/send', result.payload);
```

---

## 🔍 What to Check

After sending, verify:

1. **API Response:**
   ```json
   {
     "success": true,
     "message": "WhatsApp message sent successfully",
     "data": {
       "messageId": "wamid.xxx...",
       "bookingNumber": "202512160010001"
     }
   }
   ```

2. **WhatsApp Message:**
   - ✅ Message received on customer phone
   - ✅ Customer name correct
   - ✅ Booking number correct
   - ✅ Amounts correct
   - ✅ Brand name correct

3. **Template Selection:**
   - ✅ Correct template used (booking_summary_nodisc, etc.)
   - ✅ Variables in correct order
   - ✅ All fields populated

---

## 🐛 Troubleshooting

### Issue: "Server not running"
**Solution:**
```bash
npm run dev
```

### Issue: "Invalid OAuth access token"
**Solution:**
- Check `.env` file has correct access token
- Token might be expired - get new one from Meta Business Manager

### Issue: "Message already sent"
**Solution:**
- Change booking_number to test again
- Or clear MongoDB if connected

### Issue: "Template not found"
**Solution:**
- Check template name in `config/templates.config.js`
- Verify template is approved in Meta Business Manager

### Issue: "Variables don't match"
**Solution:**
- Check variable count matches template
- Check variable order matches template
- Use `node test-variable-mapping.js` to debug

---

## ✅ Quick Test Checklist

- [ ] Server running (`npm run dev`)
- [ ] Credentials set in `.env`
- [ ] Test script ready
- [ ] Phone number ready (your number for testing)
- [ ] Run test command
- [ ] Check WhatsApp message
- [ ] Verify all fields correct

---

## 🚀 Recommended Testing Flow

1. **Start with sample data:**
   ```bash
   node test-with-sample-booking.js 918590292642
   ```

2. **Test with real API data:**
   ```bash
   node test-with-booking-api.js 202512160010001 918590292642
   ```

3. **Test all templates:**
   ```bash
   node test-simple.js 918590292642 1  # Booking with discount
   node test-simple.js 918590292642 2  # Booking without discount
   node test-simple.js 918590292642 3  # Rent-out with discount
   node test-simple.js 918590292642 4  # Rent-out without discount
   ```

4. **Verify in production:**
   - Test with real customer bookings
   - Monitor database logs
   - Check WhatsApp delivery

---

## 📞 Need Help?

- Check server logs for errors
- Use `node test-variable-mapping.js` to debug variables
- Check `HOW-IT-WORKS.md` for system flow
- Check `AUTO-TEMPLATE-SELECTION.md` for template detection
