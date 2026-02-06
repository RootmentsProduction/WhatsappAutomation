# How The WhatsApp Automation System Works

## 🎯 Complete System Flow

This document explains how the entire WhatsApp automation system works, from receiving booking data to sending WhatsApp messages.

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Rootments Booking API                      │
│         (Your existing booking system)                        │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        │ POST /whatsapp/send
                        │ (Booking data)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  1. SERVER.JS (Express Server)                               │
│     - Receives HTTP requests                                  │
│     - Port: 5000                                              │
│     - Routes to /whatsapp/send                               │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  2. ROUTES/WHATSAPP.ROUTES.JS                               │
│     - Validates request data                                 │
│     - Checks: brand, event_type, template_type              │
│     - Validates: customer_name, phone, booking_number, etc. │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        │ Calls messageService.sendMessage()
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  3. SERVICES/MESSAGE.SERVICE.JS                             │
│     ✓ Checks for duplicate messages                         │
│     ✓ Gets template config                                  │
│     ✓ Gets brand credentials                                │
│     ✓ Maps variables                                        │
│     ✓ Calls WhatsApp service                                │
│     ✓ Logs to database                                      │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        │ Calls whatsappService.sendTemplateMessage()
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  4. SERVICES/WHATSAPP.SERVICE.JS                            │
│     - Builds WhatsApp API payload                           │
│     - Calls Meta WhatsApp Business API                      │
│     - Returns message ID                                    │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        │ HTTP POST to Meta API
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  5. META WHATSAPP BUSINESS API                              │
│     - Validates template                                    │
│     - Sends message to customer                             │
│     - Returns message ID                                    │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        ▼
                    Customer's WhatsApp 📱
```

---

## 🔄 Step-by-Step Flow

### Step 1: Request Arrives (`server.js`)

```javascript
// Server starts and listens on port 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Routes all /whatsapp/* requests to whatsapp.routes.js
app.use('/whatsapp', require('./routes/whatsapp.routes'));
```

**What happens:**
- Express server receives POST request to `/whatsapp/send`
- Request is forwarded to WhatsApp routes handler

---

### Step 2: Validation (`routes/whatsapp.routes.js`)

```javascript
// Validates the request data
const validateSendMessage = [
  body('brand').isIn(['suitorguy', 'zorucci']),
  body('event_type').isIn(['booking', 'rentout']),
  body('template_type').isIn(['withdiscount', 'nodisc']),
  body('customer_name').notEmpty(),
  body('customer_phone').notEmpty(),
  // ... more validations
];

router.post('/send', validateSendMessage, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Call message service
  const result = await messageService.sendMessage(req.body);
});
```

**What happens:**
- Validates all required fields
- Checks brand is valid (suitorguy or zorucci)
- Checks event_type is valid (booking or rentout)
- Checks template_type is valid (withdiscount or nodisc)
- If validation passes, calls message service

---

### Step 3: Message Processing (`services/message.service.js`)

#### 3.1 Check for Duplicates

```javascript
// Prevents sending same message twice
const existingLog = await MessageLog.findOne({
  bookingNumber: booking_number,
  eventType: event_type
});

if (existingLog) {
  throw new Error(`Message already sent for ${event_type} ${booking_number}`);
}
```

**What happens:**
- Checks MongoDB if message was already sent for this booking
- Prevents duplicate messages

#### 3.2 Get Template Configuration

```javascript
// Gets template based on event_type + template_type
const template = templatesConfig[event_type]?.[template_type];
// Example: templatesConfig['booking']['nodisc']
// Returns: { name: 'booking_summary_nodisc', variables: [...] }
```

**What happens:**
- Selects correct template from config
- Gets template name and variable list

#### 3.3 Get Brand Configuration

```javascript
// Gets brand credentials (phone number ID, access token)
const brandConfig = whatsappConfig[brand];
// Example: whatsappConfig['suitorguy']
// Returns: { phoneNumberId, accessToken, businessPhone, displayName }
```

**What happens:**
- Gets WhatsApp credentials for the brand
- Gets phone number ID and access token from `.env`

#### 3.4 Map Variables

```javascript
// Maps payload data to template variables
const variables = this.mapVariables(payload, template.variables, brandConfig);

// Example mapping:
// payload.customer_name → variables[0] = "ASHWIN TOM"
// payload.booking_number → variables[1] = "BK12345"
// payload.total_amount → variables[2] = "11399"
// ...
// brandConfig.displayName → variables[7] = "SuitorGuy"
```

**What happens:**
- Takes data from request payload
- Maps each field to template variable position
- Adds brand name and contact automatically
- Returns array of values in correct order

#### 3.5 Send WhatsApp Message

```javascript
// Calls WhatsApp service to send message
const result = await whatsappService.sendTemplateMessage(
  brand,              // 'suitorguy'
  template.name,      // 'booking_summary_nodisc'
  customer_phone,     // '918590292642'
  variables           // ['ASHWIN TOM', 'BK12345', '11399', ...]
);
```

**What happens:**
- Passes all data to WhatsApp service
- Waits for response with message ID

#### 3.6 Log to Database

```javascript
// Saves message log to MongoDB
const messageLog = new MessageLog({
  brand: 'suitorguy',
  eventType: 'booking',
  templateName: 'booking_summary_nodisc',
  customerPhone: '918590292642',
  bookingNumber: 'BK12345',
  status: 'sent',
  whatsappMessageId: 'wamid.xxx...',
  payload: { ... }
});
await messageLog.save();
```

**What happens:**
- Saves message details to MongoDB
- Tracks: brand, event type, template, phone, booking number, status, message ID

---

### Step 4: Send to WhatsApp API (`services/whatsapp.service.js`)

```javascript
// Builds WhatsApp API request
const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

const payload = {
  messaging_product: 'whatsapp',
  to: '918590292642',
  type: 'template',
  template: {
    name: 'booking_summary_nodisc',
    language: { code: 'en' },
    components: [{
      type: 'body',
      parameters: [
        { type: 'text', text: 'ASHWIN TOM' },      // {{1}}
        { type: 'text', text: 'BK12345' },         // {{2}}
        { type: 'text', text: '11399' },           // {{3}}
        { type: 'text', text: '0' },               // {{4}}
        { type: 'text', text: '11399' },           // {{5}}
        { type: 'text', text: '0' },               // {{6}}
        { type: 'text', text: '11399' },           // {{7}}
        { type: 'text', text: 'SuitorGuy' }        // {{8}}
      ]
    }]
  }
};

// Sends to Meta API
const response = await axios.post(url, payload, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});

// Returns message ID
return {
  success: true,
  messageId: response.data.messages[0].id
};
```

**What happens:**
- Builds WhatsApp API request payload
- Formats variables as text parameters
- Sends POST request to Meta WhatsApp Business API
- Uses brand's access token for authentication
- Returns message ID from Meta

---

### Step 5: Meta WhatsApp API

**What happens:**
- Meta API receives the request
- Validates template name exists and is approved
- Validates phone number format
- Validates variable count matches template
- Sends message to customer's WhatsApp
- Returns message ID (e.g., `wamid.HBgM...`)

---

### Step 6: Customer Receives Message

**What happens:**
- Customer receives WhatsApp message
- Message uses approved template format
- All variables are filled in correctly
- Message appears in customer's WhatsApp

---

## 🤖 Automatic Template Selection

When using Rootments API data, the system automatically selects the correct template:

### Booking Mapper Service (`services/booking-mapper.service.js`)

```javascript
// Automatically detects event type
const eventType = detectEventType(booking);
// Checks: status field, rentOutDate, returnDate
// Returns: 'booking' or 'rentout'

// Automatically detects discount
const hasDiscount = hasDiscount(booking);
// Checks: discount field, discountAmount, price vs finalPrice
// Returns: true or false

// Automatically selects template
const templateType = hasDiscount ? 'withdiscount' : 'nodisc';
```

**Example:**
```javascript
// Input: Rootments booking data
{
  status: "Booked",
  price: 11399,
  finalPrice: 11399
}

// Auto-detection:
// eventType = 'booking' (status contains "book")
// hasDiscount = false (price === finalPrice)
// templateType = 'nodisc'
// templateName = 'booking_summary_nodisc'
```

---

## 📁 File Structure & Responsibilities

### Configuration Files

**`config/whatsapp.config.js`**
- Stores brand credentials (phone number ID, access token)
- Loads from `.env` file
- Supports multiple brands (SuitorGuy, Zorucci)

**`config/templates.config.js`**
- Defines all template names and variable order
- Maps: event_type + template_type → template name
- Lists variables in exact order for each template

### Service Files

**`services/message.service.js`**
- Main business logic
- Handles duplicate checking
- Maps variables to template format
- Coordinates between services

**`services/whatsapp.service.js`**
- Communicates with Meta WhatsApp API
- Builds API request payload
- Handles API errors

**`services/booking-mapper.service.js`**
- Automatically detects event type (booking/rentout)
- Automatically detects discount (yes/no)
- Maps Rootments API format to WhatsApp API format

### Route Files

**`routes/whatsapp.routes.js`**
- Defines API endpoint: POST `/whatsapp/send`
- Validates request data
- Handles errors and responses

### Model Files

**`models/MessageLog.js`**
- MongoDB schema for message logs
- Tracks all sent messages
- Prevents duplicates

---

## 🔑 Key Features

### 1. Duplicate Prevention
- Checks MongoDB before sending
- Prevents sending same message twice for same booking

### 2. Automatic Template Selection
- Detects booking vs rentout from status/date fields
- Detects discount from amount fields
- Selects correct template automatically

### 3. Multi-Brand Support
- Supports SuitorGuy and Zorucci
- Each brand has separate credentials
- Each brand can have different templates

### 4. Error Handling
- Validates all input data
- Handles API errors gracefully
- Logs failures to database

### 5. Database Logging
- Saves all messages to MongoDB
- Tracks success/failure
- Stores WhatsApp message IDs

---

## 📝 Example: Complete Flow

### Input (from Rootments API or manual request):

```json
{
  "brand": "suitorguy",
  "event_type": "booking",
  "template_type": "nodisc",
  "customer_name": "ASHWIN TOM",
  "customer_phone": "918590292642",
  "booking_number": "BK12345",
  "total_amount": "11399",
  "discount_amount": "0",
  "payable_amount": "11399",
  "advance_paid": "0",
  "balance_due": "11399"
}
```

### Processing Steps:

1. **Validation** ✓
   - All fields valid
   - Brand: suitorguy ✓
   - Event: booking ✓
   - Template: nodisc ✓

2. **Duplicate Check** ✓
   - No existing message found
   - Proceed with sending

3. **Template Selection** ✓
   - Template: `booking_summary_nodisc`
   - Variables: 8 variables needed

4. **Variable Mapping** ✓
   - Maps to: `['ASHWIN TOM', 'BK12345', '11399', '0', '11399', '0', '11399', 'SuitorGuy']`

5. **WhatsApp API Call** ✓
   - URL: `https://graph.facebook.com/v18.0/592456870611613/messages`
   - Payload: Template message with variables
   - Response: `{ messages: [{ id: 'wamid.xxx...' }] }`

6. **Database Log** ✓
   - Saves: brand, event, template, phone, booking, status, message ID

7. **Response** ✓
   ```json
   {
     "success": true,
     "message": "WhatsApp message sent successfully",
     "data": {
       "success": true,
       "messageId": "wamid.xxx...",
       "bookingNumber": "BK12345"
     }
   }
   ```

---

## 🎯 Summary

**The system works in 6 main steps:**

1. **Receive** - Express server receives POST request
2. **Validate** - Validates all required fields
3. **Process** - Checks duplicates, selects template, maps variables
4. **Send** - Calls Meta WhatsApp API with template message
5. **Log** - Saves message details to database
6. **Respond** - Returns success/failure response

**Key Features:**
- ✅ Automatic template selection
- ✅ Duplicate prevention
- ✅ Multi-brand support
- ✅ Error handling
- ✅ Database logging
- ✅ Swagger documentation

**Everything is automatic** - you just send booking data, and the system handles the rest! 🚀
