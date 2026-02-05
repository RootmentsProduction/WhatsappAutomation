# Testing Guide

## Prerequisites

Before testing, ensure:
1. ✅ Server is running (`npm run dev`)
2. ✅ WhatsApp credentials are configured in `.env`
3. ✅ WhatsApp templates are approved in Meta Business Manager

## Testing Methods

### Method 1: Using Postman or Thunder Client (Recommended)

1. **Install Extension:**
   - VS Code: Install "Thunder Client" or "REST Client" extension
   - Or use Postman desktop app

2. **Import Tests:**
   - Open `test.http` file
   - Click "Send Request" above each test

3. **Verify:**
   - Check API response (should be 200 OK)
   - Check WhatsApp message on customer phone
   - Verify correct brand and template

### Method 2: Using cURL (Command Line)

```bash
# Test 1: SuitorGuy Booking with Discount
curl -X POST http://localhost:5000/whatsapp/send ^
  -H "Content-Type: application/json" ^
  -d "{\"brand\":\"suitorguy\",\"event_type\":\"booking\",\"template_type\":\"withdiscount\",\"customer_name\":\"John Doe\",\"customer_phone\":\"919876543210\",\"booking_number\":\"BK001\",\"total_amount\":\"5000\",\"discount_amount\":\"500\",\"payable_amount\":\"4500\",\"advance_paid\":\"2000\",\"balance_due\":\"2500\"}"
```

### Method 3: Using Node.js Test Script

```bash
node test-api.js
```

This will run all 4 test cases automatically.

### Method 4: Testing with Real Template Messages (Recommended for Real Testing)

**Option A: Interactive Test Script**

```bash
node test-real-template.js
```

This interactive script will:
- Show all available templates
- Prompt you to select a template (1-4)
- Ask for your real phone number
- Ask for customer name (optional)
- Send the message and show results

**Option B: Quick Command Line Test**

```bash
# Test with your phone number
node test-simple.js <your_phone_number> [template_number]

# Examples:
node test-simple.js 919876543210 1    # SuitorGuy Booking with Discount
node test-simple.js 919876543210 2    # SuitorGuy Booking without Discount
node test-simple.js 919876543210 3    # Zorucci Rent-out with Discount
node test-simple.js 919876543210 4    # Zorucci Rent-out without Discount
```

**Available Template Numbers:**
- `1` = SuitorGuy Booking with Discount
- `2` = SuitorGuy Booking without Discount
- `3` = Zorucci Rent-out with Discount
- `4` = Zorucci Rent-out without Discount

**Phone Number Format:**
- Use country code + number (e.g., `919876543210` for India)
- No `+` sign, just numbers
- Example: `919876543210` (India), `14155551234` (US)

## Test Checklist

### SuitorGuy Tests
- [ ] Booking with discount - Message received
- [ ] Booking without discount - Message received
- [ ] Rent-out with discount - Message received
- [ ] Rent-out without discount - Message received

### Zorucci Tests
- [ ] Booking with discount - Message received
- [ ] Booking without discount - Message received
- [ ] Rent-out with discount - Message received
- [ ] Rent-out without discount - Message received

## What to Verify

For each test:
1. **API Response:**
   ```json
   {
     "success": true,
     "message": "WhatsApp message sent successfully",
     "data": {
       "success": true,
       "messageId": "wamid.xxx",
       "bookingNumber": "BK001"
     }
   }
   ```

2. **WhatsApp Message:**
   - Message received on customer phone
   - Correct brand name displayed
   - All variables populated correctly
   - Correct template used

3. **Database Log (if MongoDB connected):**
   - Entry created in MessageLog collection
   - Status = 'sent'
   - WhatsApp message ID saved

## Common Issues

### Issue: "Invalid brand"
**Solution:** Check `.env` has correct credentials for the brand

### Issue: "Template not found"
**Solution:** Ensure template is approved in Meta Business Manager

### Issue: "Invalid phone number"
**Solution:** Use format: 919876543210 (country code + number, no +)

### Issue: "Message already sent"
**Solution:** This is duplicate prevention working. Change booking_number to test again

## Testing with Real Template Messages

**IMPORTANT:** Always test with real WhatsApp numbers to verify:
- Message delivery
- Template formatting
- Variable substitution
- Brand identification

### Quick Start for Real Template Testing

1. **Start your server:**
   ```bash
   npm run dev
   ```

2. **Run the interactive test:**
   ```bash
   node test-real-template.js
   ```

3. **Or use the quick command:**
   ```bash
   node test-simple.js 919876543210 1
   ```
   (Replace `919876543210` with your real WhatsApp number)

4. **Check your WhatsApp** - You should receive the template message!

### What Gets Tested

When you use the real template test scripts:
- ✅ Real WhatsApp API call is made
- ✅ Template message is sent to your phone
- ✅ All variables are populated correctly
- ✅ Brand information is displayed
- ✅ Message ID is returned
- ✅ Database logging (if MongoDB connected)

### Tips for Real Testing

- **Use your own number first** to verify everything works
- **Test all 4 templates** to ensure all scenarios work
- **Check the message formatting** on your phone
- **Verify all variables** are showing correctly
- **Test with different brands** (SuitorGuy and Zorucci)

## Production Testing

Before going live:
1. Test all 8 combinations (2 brands × 2 events × 2 discount types)
2. Verify with actual customer numbers
3. Check MongoDB logs
4. Monitor WhatsApp API usage
5. Test duplicate prevention
6. Test error handling (invalid data)

## Monitoring

Check server logs for:
```
✅ WhatsApp message sent successfully
❌ WhatsApp API Error
⚠️  MongoDB not connected
```
