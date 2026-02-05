# Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account**
   - Create free cluster at mongodb.com/cloud/atlas
   - Get connection string
   - Update MONGODB_URI in .env

2. **WhatsApp Business API Access**
   - Meta Business Account
   - WhatsApp Business API credentials for both brands
   - Approved message templates

## Configuration Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Update `.env` with:

**MongoDB:**
- Get connection string from MongoDB Atlas
- Replace `<username>`, `<password>`, and cluster URL

**SuitorGuy WhatsApp:**
- `SUITORGUY_PHONE_NUMBER_ID`: From Meta Business Manager
- `SUITORGUY_ACCESS_TOKEN`: WhatsApp Business API token
- `SUITORGUY_BUSINESS_PHONE`: Display phone number

**Zorucci WhatsApp:**
- Same as above for Zorucci brand

### 3. WhatsApp Template Setup

Ensure these templates are approved in Meta Business Manager:
- `booking_summary_withdiscount`
- `booking_summary_nodisc`
- `rentout_summary_withdiscount`
- `rentout_summary_nodisc`

### 4. Start Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## Testing Checklist

Test all 8 combinations:

**SuitorGuy:**
- [ ] Booking with discount
- [ ] Booking without discount
- [ ] Rent-out with discount
- [ ] Rent-out without discount

**Zorucci:**
- [ ] Booking with discount
- [ ] Booking without discount
- [ ] Rent-out with discount
- [ ] Rent-out without discount

### Test Command Example:
```bash
curl -X POST http://localhost:5000/whatsapp/send \
  -H "Content-Type: application/json" \
  -d @test-payloads.json
```

## Verification

For each test:
1. Check API response (200 OK)
2. Verify WhatsApp message received on customer phone
3. Check MongoDB for message log entry
4. Confirm correct brand and template used

## Production Deployment

Recommended platforms:
- **Heroku**: Easy deployment
- **AWS EC2**: Full control
- **DigitalOcean**: Simple VPS
- **Railway**: Modern deployment

Set environment variables in your hosting platform.

## Monitoring

Check logs for:
- Message send success/failure
- WhatsApp API errors
- Duplicate prevention
- Database connectivity

## Security

- Never commit .env file
- Use IP whitelisting if possible
- Rotate access tokens regularly
- Monitor API usage
