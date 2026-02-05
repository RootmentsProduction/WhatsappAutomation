# WhatsApp Notification Backend

Backend service for sending automated WhatsApp messages for booking and rent-out confirmations.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
   - MongoDB connection string
   - WhatsApp Business API credentials for both brands

3. **Connect Your Meta Templates** (Important!):
   ```bash
   # List your approved templates from Meta
   node list-meta-templates.js suitorguy
   node list-meta-templates.js zorucci
   
   # Update template names in config
   node update-template-name.js
   ```
   
   See [CONNECT-META-TEMPLATE.md](./CONNECT-META-TEMPLATE.md) for detailed instructions.

4. Start the server:
```bash
npm run dev
```

## API Endpoint

### POST /whatsapp/send

Send WhatsApp notification for booking or rent-out.

**Request Body:**

```json
{
  "brand": "suitorguy",
  "event_type": "booking",
  "template_type": "withdiscount",
  "customer_name": "John Doe",
  "customer_phone": "919876543210",
  "booking_number": "BK12345",
  "total_amount": "5000",
  "discount_amount": "500",
  "payable_amount": "4500",
  "advance_paid": "2000",
  "balance_due": "2500"
}
```

**Response:**

```json
{
  "success": true,
  "message": "WhatsApp message sent successfully",
  "data": {
    "success": true,
    "messageId": "wamid.xxx",
    "bookingNumber": "BK12345"
  }
}
```

## Supported Templates

### Booking Templates
- `booking_summary_withdiscount` (or your Meta template name)
- `booking_summary_nodisc` (or your Meta template name)

### Rent-out Templates
- `rentout_summary_withdiscount` (or your Meta template name)
- `rentout_summary_nodisc` (or your Meta template name)

**Note:** Template names must match your approved Meta templates exactly. Use `list-meta-templates.js` to find your template names.

## Testing

### Quick Test with Real Template Messages

**Interactive Test (Recommended):**
```bash
node test-real-template.js
```

**Quick Command Line Test:**
```bash
node test-simple.js <your_phone_number> [template_number]

# Example:
node test-simple.js 919876543210 1
```

**Available Templates:**
- `1` = SuitorGuy Booking with Discount
- `2` = SuitorGuy Booking without Discount
- `3` = Zorucci Rent-out with Discount
- `4` = Zorucci Rent-out without Discount

### Other Testing Methods

- **Automated Tests:** `node test-api.js` (runs all 4 test cases)
- **HTTP File:** Use `test.http` with REST Client extension
- **Postman:** Import the API endpoint and test manually

For detailed testing instructions, see [TESTING.md](./TESTING.md)

### Test Coverage

Test all combinations:
- SuitorGuy + Zorucci
- Booking + Rent-out
- With Discount + No Discount

**Important:** Always test with real phone numbers to verify template formatting and delivery.
