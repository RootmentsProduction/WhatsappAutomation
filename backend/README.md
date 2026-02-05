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

3. Start the server:
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
- `booking_summary_withdiscount`
- `booking_summary_nodisc`

### Rent-out Templates
- `rentout_summary_withdiscount`
- `rentout_summary_nodisc`

## Testing

Test all combinations:
- SuitorGuy + Zorucci
- Booking + Rent-out
- With Discount + No Discount

Use real phone numbers for testing.
