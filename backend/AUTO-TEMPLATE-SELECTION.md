# Automatic Template Selection

## 🎯 Overview

The system **automatically selects the correct WhatsApp template** based on your Rootments API booking data. No manual selection needed!

## 📋 Template Mapping

Based on your API data, the system automatically chooses:

| API Data Condition | Selected Template |
|-------------------|-------------------|
| **Booking** + **Has Discount** | `booking_summary_withdiscount` |
| **Booking** + **No Discount** | `booking_summary_nodisc` |
| **Rent-out** + **Has Discount** | `rentout_summary_withdiscount` |
| **Rent-out** + **No Discount** | `rentout_summary_nodisc` |

## 🔍 How It Works

### 1. Event Type Detection (Booking vs Rent-out)

The system checks in this order:

1. **Status Field:**
   - If status contains "rent", "rentout", or "rent out" → **Rent-out**
   - If status contains "book" or is "booked" → **Booking**

2. **Date Fields:**
   - If `rentOutDate` exists and is not null → **Rent-out**
   - If `returnDate` exists → **Rent-out**
   - Otherwise → **Booking**

### 2. Discount Detection

The system checks for discount in multiple ways:

1. **Direct Discount Fields:**
   - `discount` field > 0
   - `discountAmount` field > 0
   - `discountPercentage` field > 0

2. **Calculated from Amounts:**
   - If `totalAmount` > `payableAmount` → Has discount
   - If `price` > `finalPrice` → Has discount

3. **If none found** → No discount

### 3. Template Selection

Based on detected event type and discount:
- `event_type: 'booking'` + `hasDiscount: true` → `booking_summary_withdiscount`
- `event_type: 'booking'` + `hasDiscount: false` → `booking_summary_nodisc`
- `event_type: 'rentout'` + `hasDiscount: true` → `rentout_summary_withdiscount`
- `event_type: 'rentout'` + `hasDiscount: false` → `rentout_summary_nodisc`

## 📝 Example Scenarios

### Scenario 1: Booking Without Discount
```json
{
  "status": "Booked",
  "price": 5000,
  "finalPrice": 5000
}
```
**Result:** `booking_summary_nodisc` ✅

### Scenario 2: Booking With Discount
```json
{
  "status": "Booked",
  "price": 5000,
  "finalPrice": 4500,
  "discount": 500
}
```
**Result:** `booking_summary_withdiscount` ✅

### Scenario 3: Rent-out Without Discount
```json
{
  "status": "Rent Out",
  "rentOutDate": "2026-01-10",
  "price": 8000,
  "finalPrice": 8000
}
```
**Result:** `rentout_summary_nodisc` ✅

### Scenario 4: Rent-out With Discount
```json
{
  "status": "Rent Out",
  "rentOutDate": "2026-01-10",
  "price": 8000,
  "finalPrice": 7200,
  "discountAmount": 800
}
```
**Result:** `rentout_summary_withdiscount` ✅

## 🛠️ Usage

### In Test Scripts

```javascript
const bookingMapper = require('./services/booking-mapper.service');

// Automatically maps and detects template
const result = bookingMapper.mapToWhatsApp(bookingData, {
  phoneNumber: '918590292642', // Optional override
  brand: 'suitorguy' // Optional, default: 'suitorguy'
});

// result.payload - WhatsApp API payload
// result.detected - Detection info
```

### Detection Info

```javascript
result.detected = {
  eventType: 'booking',        // 'booking' or 'rentout'
  templateType: 'nodisc',      // 'withdiscount' or 'nodisc'
  hasDiscount: false,          // true or false
  templateName: 'booking_summary_nodisc' // Final template name
}
```

## 🔧 Customization

If your API uses different field names, update `services/booking-mapper.service.js`:

### Add Custom Discount Detection

```javascript
hasDiscount(booking) {
  // Add your custom logic here
  if (booking.yourDiscountField > 0) {
    return true;
  }
  // ... existing checks
}
```

### Add Custom Event Type Detection

```javascript
detectEventType(booking) {
  // Add your custom logic here
  if (booking.yourStatusField === 'your_value') {
    return 'rentout';
  }
  // ... existing checks
}
```

## ✅ Testing

Test automatic template selection:

```bash
# Test with sample booking data
node test-with-sample-booking.js 918590292642

# Test with real API data
node test-with-booking-api.js [booking_number] [phone_number]
```

## 📊 What Gets Detected

The system automatically:
- ✅ Detects if it's a booking or rent-out
- ✅ Detects if discount exists
- ✅ Selects the correct template
- ✅ Maps all required fields
- ✅ Formats phone numbers
- ✅ Calculates amounts

**You just provide the booking data - everything else is automatic!** 🚀
