# Implementation Flow - Where Everything Is

## 📍 Complete Request Flow (Technowave → WhatsApp)

```
Technowave Software
       ↓
   [POST Request]
       ↓
┌──────────────────────────────────────────────────────────────┐
│ 1. SERVER.JS (Line 38)                                       │
│    Location: backend/server.js                               │
│    Code: app.use('/whatsapp', require('./routes/whatsapp.routes'))│
│    ✅ Receives POST /whatsapp/send                           │
└──────────────────────────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. ROUTES/WHATSAPP.ROUTES.JS (Line 22)                      │
│    Location: backend/routes/whatsapp.routes.js               │
│    Code: router.post('/send', validateSendMessage, ...)      │
│                                                               │
│    ✅ VALIDATES DATA (Lines 8-18):                           │
│       - brand must be 'suitorguy' or 'zorucci'              │
│       - event_type must be 'booking' or 'rentout'           │
│       - template_type must be 'withdiscount' or 'nodisc'    │
│       - customer_name, phone, booking_number required        │
│                                                               │
│    ✅ CALLS MESSAGE SERVICE (Line 31):                       │
│       const result = await messageService.sendMessage(req.body)│
└──────────────────────────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. SERVICES/MESSAGE.SERVICE.JS (Line 7)                     │
│    Location: backend/services/message.service.js             │
│    Code: async sendMessage(payload)                          │
│                                                               │
│    ✅ IDENTIFIES BRAND (Line 38):                            │
│       const brandConfig = whatsappConfig[brand]              │
│       → Goes to config/whatsapp.config.js                    │
│       → Gets SuitorGuy or Zorucci credentials                │
│                                                               │
│    ✅ IDENTIFIES EVENT TYPE & SELECTS TEMPLATE (Line 31):    │
│       const template = templatesConfig[event_type]?.[template_type]│
│       → Goes to config/templates.config.js                   │
│       → booking + withdiscount = booking_summary_withdiscount│
│       → booking + nodisc = booking_summary_nodisc            │
│       → rentout + withdiscount = rentout_summary_withdiscount│
│       → rentout + nodisc = rentout_summary_nodisc            │
│                                                               │
│    ✅ MAPS VARIABLES (Line 44):                              │
│       const variables = this.mapVariables(...)               │
│       → Combines customer data + brand info                  │
│                                                               │
│    ✅ SENDS MESSAGE (Line 48):                               │
│       await whatsappService.sendTemplateMessage(...)         │
│                                                               │
│    ✅ LOGS TO DATABASE (Line 57):                            │
│       await messageLog.save()                                │
└──────────────────────────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. CONFIG/WHATSAPP.CONFIG.JS                                 │
│    Location: backend/config/whatsapp.config.js               │
│                                                               │
│    ✅ BRAND IDENTIFICATION (Lines 2-17):                     │
│       suitorguy: {                                           │
│         phoneNumberId: SUITORGUY_PHONE_NUMBER_ID            │
│         accessToken: SUITORGUY_ACCESS_TOKEN                 │
│         businessPhone: SUITORGUY_BUSINESS_PHONE             │
│         displayName: 'SuitorGuy'                            │
│       }                                                      │
│       zorucci: {                                             │
│         phoneNumberId: ZORUCCI_PHONE_NUMBER_ID              │
│         accessToken: ZORUCCI_ACCESS_TOKEN                   │
│         businessPhone: ZORUCCI_BUSINESS_PHONE               │
│         displayName: 'Zorucci'                              │
│       }                                                      │
└──────────────────────────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. CONFIG/TEMPLATES.CONFIG.JS                                │
│    Location: backend/config/templates.config.js              │
│                                                               │
│    ✅ TEMPLATE SELECTION (Lines 2-48):                       │
│       booking: {                                             │
│         withdiscount: {                                      │
│           name: 'booking_summary_withdiscount'              │
│           variables: [9 fields]                             │
│         }                                                    │
│         nodisc: {                                            │
│           name: 'booking_summary_nodisc'                    │
│           variables: [8 fields]                             │
│         }                                                    │
│       }                                                      │
│       rentout: {                                             │
│         withdiscount: {                                      │
│           name: 'rentout_summary_withdiscount'              │
│           variables: [11 fields]                            │
│         }                                                    │
│         nodisc: {                                            │
│           name: 'rentout_summary_nodisc'                    │
│           variables: [10 fields]                            │
│         }                                                    │
│       }                                                      │
└──────────────────────────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────────────────────────┐
│ 6. SERVICES/WHATSAPP.SERVICE.JS                              │
│    Location: backend/services/whatsapp.service.js            │
│                                                               │
│    ✅ SENDS TO WHATSAPP API (Line 7):                        │
│       async sendTemplateMessage(brand, templateName, ...)    │
│       → Uses brand-specific credentials                      │
│       → Calls WhatsApp Business API                          │
│       → Returns message ID                                   │
└──────────────────────────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────────────────────────┐
│ 7. MODELS/MESSAGELOG.JS                                      │
│    Location: backend/models/MessageLog.js                    │
│                                                               │
│    ✅ LOGS MESSAGE ACTIVITY (Lines 4-32):                    │
│       - brand                                                │
│       - eventType (booking/rentout)                          │
│       - templateName                                         │
│       - customerPhone                                        │
│       - bookingNumber                                        │
│       - whatsappMessageId                                    │
│       - status (sent/failed)                                 │
│       - timestamps (automatic)                               │
│                                                               │
│    ✅ DUPLICATE PREVENTION (Line 36):                        │
│       Unique index on: bookingNumber + eventType             │
└──────────────────────────────────────────────────────────────┘
       ↓
   WhatsApp Business API
       ↓
   Customer's WhatsApp
```

---

## 🎯 Example: Real Technowave Request

### **Technowave Sends:**
```json
POST http://your-backend.com/whatsapp/send
{
  "brand": "suitorguy",
  "event_type": "booking",
  "template_type": "withdiscount",
  "customer_name": "Rajesh Kumar",
  "customer_phone": "918590292642",
  "booking_number": "BK78945",
  "total_amount": "15000",
  "discount_amount": "1500",
  "payable_amount": "13500",
  "advance_paid": "5000",
  "balance_due": "8500"
}
```

### **What Happens (Step by Step):**

**Step 1: server.js (Line 38)**
```javascript
app.use('/whatsapp', require('./routes/whatsapp.routes'))
// ✅ Routes request to whatsapp.routes.js
```

**Step 2: routes/whatsapp.routes.js (Lines 8-18)**
```javascript
body('brand').isIn(['suitorguy', 'zorucci'])
// ✅ Validates: brand = "suitorguy" ✓

body('event_type').isIn(['booking', 'rentout'])
// ✅ Validates: event_type = "booking" ✓

body('template_type').isIn(['withdiscount', 'nodisc'])
// ✅ Validates: template_type = "withdiscount" ✓
```

**Step 3: services/message.service.js (Line 38)**
```javascript
const brandConfig = whatsappConfig[brand]
// ✅ brand = "suitorguy"
// ✅ Gets from config/whatsapp.config.js:
//    phoneNumberId: 592456870611613
//    accessToken: EAAIxXzYDBZAwBO6eAeuzUdsA1dBV3Q...
//    businessPhone: 8943300097
//    displayName: 'SuitorGuy'
```

**Step 4: services/message.service.js (Line 31)**
```javascript
const template = templatesConfig[event_type]?.[template_type]
// ✅ event_type = "booking"
// ✅ template_type = "withdiscount"
// ✅ Gets from config/templates.config.js:
//    name: 'booking_summary_withdiscount'
//    variables: [9 fields]
```

**Step 5: services/message.service.js (Line 44)**
```javascript
const variables = this.mapVariables(payload, template.variables, brandConfig)
// ✅ Maps to array:
//    [0] "Rajesh Kumar"        (customer_name)
//    [1] "BK78945"             (booking_number)
//    [2] "15000"               (total_amount)
//    [3] "1500"                (discount_amount)
//    [4] "13500"               (payable_amount)
//    [5] "5000"                (advance_paid)
//    [6] "8500"                (balance_due)
//    [7] "SuitorGuy"           (brand_name - from config)
//    [8] "8943300097"          (brand_contact - from config)
```

**Step 6: services/whatsapp.service.js (Line 7)**
```javascript
await whatsappService.sendTemplateMessage(
  "suitorguy",                          // brand
  "booking_summary_withdiscount",       // template name
  "918590292642",                       // customer phone
  [...variables]                        // mapped data
)
// ✅ Sends to WhatsApp API using SuitorGuy credentials
// ✅ Returns message ID: "wamid.HBgLOTE4NTkwMjkyNjQyFQIAERgSMzQxRjE3..."
```

**Step 7: models/MessageLog.js**
```javascript
await messageLog.save()
// ✅ Saves to MongoDB:
//    brand: "suitorguy"
//    eventType: "booking"
//    templateName: "booking_summary_withdiscount"
//    customerPhone: "918590292642"
//    bookingNumber: "BK78945"
//    whatsappMessageId: "wamid.HBgLOTE4NTkwMjkyNjQyFQIAERgSMzQxRjE3..."
//    status: "sent"
//    createdAt: 2025-01-29T10:30:45.123Z
```

---

## 📂 File Locations Summary

| What | Where | Line |
|------|-------|------|
| **Receives Technowave Request** | `server.js` | 38 |
| **Validates Data** | `routes/whatsapp.routes.js` | 8-18 |
| **Identifies Brand** | `services/message.service.js` | 38 |
| **Selects Template** | `services/message.service.js` | 31 |
| **Brand Credentials** | `config/whatsapp.config.js` | 2-17 |
| **Template Mappings** | `config/templates.config.js` | 2-48 |
| **Sends to WhatsApp** | `services/whatsapp.service.js` | 7 |
| **Logs Activity** | `models/MessageLog.js` | 4-32 |

---

## ✅ Conclusion

**Everything is implemented!** Your backend is ready to receive real data from Technowave. The test scripts (`test-fresh.js`) use the exact same logic that Technowave will use - the only difference is who sends the request.
