# Complete Step-by-Step Tutorial: Building WhatsApp Notification Backend

## 📚 What You'll Learn
- How to build a Node.js/Express backend from scratch
- How to integrate WhatsApp Business API
- How to use MongoDB for logging
- How to structure a production-ready API
- How to handle multiple brands dynamically

---

## 🎯 Step 1: Project Setup

### 1.1 Create Project Structure
```bash
mkdir backend
cd backend
```

### 1.2 Initialize Node.js Project
```bash
npm init -y
```

This creates `package.json` - the file that tracks your project dependencies.

### 1.3 Install Dependencies
```bash
npm install express mongoose dotenv cors axios express-validator
npm install nodemon --save-dev
```

**What each package does:**
- `express` - Web framework for creating API endpoints
- `mongoose` - MongoDB database connection and models
- `dotenv` - Load environment variables from .env file
- `cors` - Allow requests from other domains (like Technowave)
- `axios` - Make HTTP requests to WhatsApp API
- `express-validator` - Validate incoming data
- `nodemon` - Auto-restart server when code changes (dev only)

### 1.4 Update package.json Scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## 🎯 Step 2: Create Basic Server

### 2.1 Create `server.js`
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware - runs before every request
app.use(cors());                              // Allow cross-origin requests
app.use(express.json());                      // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
};

connectDB();

// Basic health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'WhatsApp Notification Backend API',
    version: '1.0.0',
    status: 'running'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

**What this does:**
- Creates an Express app
- Connects to MongoDB
- Sets up middleware to handle requests
- Creates a basic route to test if server is running
- Starts listening on port 5000

---

## 🎯 Step 3: Environment Configuration

### 3.1 Create `.env` File
```env
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp_notifications

# SuitorGuy WhatsApp Configuration
SUITORGUY_PHONE_NUMBER_ID=your_phone_number_id
SUITORGUY_ACCESS_TOKEN=your_access_token
SUITORGUY_BUSINESS_PHONE=your_business_phone

# Zorucci WhatsApp Configuration
ZORUCCI_PHONE_NUMBER_ID=your_phone_number_id
ZORUCCI_ACCESS_TOKEN=your_access_token
ZORUCCI_BUSINESS_PHONE=your_business_phone
```

**Why .env?**
- Keeps secrets out of code
- Different values for dev/production
- Easy to change without touching code

### 3.2 Create `.gitignore`
```
node_modules
.env
.DS_Store
*.log
```

**Why .gitignore?**
- Prevents committing secrets to Git
- Keeps repository clean

---

## 🎯 Step 4: Configuration Files

### 4.1 Create `config/whatsapp.config.js`
```javascript
module.exports = {
  suitorguy: {
    phoneNumberId: process.env.SUITORGUY_PHONE_NUMBER_ID,
    accessToken: process.env.SUITORGUY_ACCESS_TOKEN,
    businessPhone: process.env.SUITORGUY_BUSINESS_PHONE,
    displayName: 'SuitorGuy'
  },
  zorucci: {
    phoneNumberId: process.env.ZORUCCI_PHONE_NUMBER_ID,
    accessToken: process.env.ZORUCCI_ACCESS_TOKEN,
    businessPhone: process.env.ZORUCCI_BUSINESS_PHONE,
    displayName: 'Zorucci'
  },
  apiUrl: 'https://graph.facebook.com/v18.0'
};
```

**Why this structure?**
- Easy to add more brands later
- Centralized brand configuration
- Dynamic brand selection based on request

### 4.2 Create `config/templates.config.js`
```javascript
module.exports = {
  booking: {
    withdiscount: {
      name: 'booking_summary_withdiscount',
      variables: [
        'customer_name',
        'booking_number',
        'total_amount',
        'discount_amount',
        'payable_amount',
        'advance_paid',
        'balance_due',
        'brand_name',
        'brand_contact'
      ]
    },
    nodisc: {
      name: 'booking_summary_nodisc',
      variables: [
        'customer_name',
        'booking_number',
        'total_amount',
        'payable_amount',
        'advance_paid',
        'balance_due',
        'brand_name',
        'brand_contact'
      ]
    }
  },
  rentout: {
    withdiscount: {
      name: 'rentout_summary_withdiscount',
      variables: [
        'customer_name',
        'booking_number',
        'total_amount',
        'discount_amount',
        'invoice_amount',
        'advance_paid',
        'balance_due',
        'security_deposit',
        'subtotal',
        'brand_name',
        'brand_contact'
      ]
    },
    nodisc: {
      name: 'rentout_summary_nodisc',
      variables: [
        'customer_name',
        'booking_number',
        'total_amount',
        'invoice_amount',
        'advance_paid',
        'balance_due',
        'security_amount',
        'subtotal',
        'brand_name',
        'brand_contact'
      ]
    }
  }
};
```

**Why this structure?**
- Maps event types to templates
- Defines variable order for each template
- Easy to add new templates

---

## 🎯 Step 5: Database Model

### 5.1 Create `models/MessageLog.js`
```javascript
const mongoose = require('mongoose');

// Define the schema (structure) for message logs
const messageLogSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    enum: ['suitorguy', 'zorucci']  // Only these values allowed
  },
  eventType: {
    type: String,
    required: true,
    enum: ['booking', 'rentout']
  },
  templateName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  bookingNumber: {
    type: String,
    required: true,
    index: true  // Makes searching by booking number faster
  },
  whatsappMessageId: {
    type: String
  },
  status: {
    type: String,
    enum: ['sent', 'failed', 'delivered', 'read'],
    default: 'sent'
  },
  errorMessage: {
    type: String
  },
  payload: {
    type: Object  // Store the original request data
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

// Prevent duplicate messages for same booking + event
messageLogSchema.index({ bookingNumber: 1, eventType: 1 }, { unique: true });

module.exports = mongoose.model('MessageLog', messageLogSchema);
```

**Key concepts:**
- **Schema** - Defines structure of data
- **Validation** - `required`, `enum` ensure data quality
- **Index** - Makes queries faster
- **Unique index** - Prevents duplicates
- **Timestamps** - Auto-tracks when records created/updated

---

## 🎯 Step 6: WhatsApp Service

### 6.1 Create `services/whatsapp.service.js`
```javascript
const axios = require('axios');
const whatsappConfig = require('../config/whatsapp.config');

class WhatsAppService {
  async sendTemplateMessage(brand, templateName, recipientPhone, variables) {
    // Get brand-specific configuration
    const brandConfig = whatsappConfig[brand];
    
    if (!brandConfig) {
      throw new Error(`Invalid brand: ${brand}`);
    }

    // Build WhatsApp API URL
    const url = `${whatsappConfig.apiUrl}/${brandConfig.phoneNumberId}/messages`;
    
    // Build request payload according to WhatsApp API format
    const payload = {
      messaging_product: 'whatsapp',
      to: recipientPhone,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: 'en'
        },
        components: [
          {
            type: 'body',
            parameters: variables.map(value => ({
              type: 'text',
              text: String(value)
            }))
          }
        ]
      }
    };

    try {
      // Send request to WhatsApp API
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${brandConfig.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        messageId: response.data.messages[0].id,
        data: response.data
      };
    } catch (error) {
      console.error('WhatsApp API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || 'Failed to send WhatsApp message');
    }
  }
}

module.exports = new WhatsAppService();
```

**What this does:**
- Encapsulates WhatsApp API logic
- Uses brand-specific credentials
- Formats data according to WhatsApp API requirements
- Handles errors gracefully

---

## 🎯 Step 7: Message Service (Business Logic)

### 7.1 Create `services/message.service.js`
```javascript
const MessageLog = require('../models/MessageLog');
const whatsappService = require('./whatsapp.service');
const templatesConfig = require('../config/templates.config');
const whatsappConfig = require('../config/whatsapp.config');

class MessageService {
  async sendMessage(payload) {
    const {
      brand,
      event_type,
      template_type,
      booking_number,
      customer_phone
    } = payload;

    // STEP 1: Check for duplicate
    try {
      const existingLog = await MessageLog.findOne({
        bookingNumber: booking_number,
        eventType: event_type
      });

      if (existingLog) {
        throw new Error(`Message already sent for ${event_type} ${booking_number}`);
      }
    } catch (error) {
      if (error.message.includes('already sent')) throw error;
      console.log('MongoDB not connected, skipping duplicate check');
    }

    // STEP 2: Get template configuration
    const template = templatesConfig[event_type]?.[template_type];
    if (!template) {
      throw new Error(`Invalid event_type or template_type`);
    }

    // STEP 3: Get brand configuration
    const brandConfig = whatsappConfig[brand];
    if (!brandConfig) {
      throw new Error(`Invalid brand: ${brand}`);
    }

    // STEP 4: Map variables from payload to template format
    const variables = this.mapVariables(payload, template.variables, brandConfig);

    try {
      // STEP 5: Send WhatsApp message
      const result = await whatsappService.sendTemplateMessage(
        brand,
        template.name,
        customer_phone,
        variables
      );

      // STEP 6: Log success to database
      try {
        const messageLog = new MessageLog({
          brand,
          eventType: event_type,
          templateName: template.name,
          customerPhone: customer_phone,
          bookingNumber: booking_number,
          status: 'sent',
          whatsappMessageId: result.messageId,
          payload
        });
        await messageLog.save();
      } catch (dbError) {
        console.log('MongoDB logging failed:', dbError.message);
      }

      return {
        success: true,
        messageId: result.messageId,
        bookingNumber: booking_number
      };
    } catch (error) {
      // STEP 7: Log failure to database
      try {
        const messageLog = new MessageLog({
          brand,
          eventType: event_type,
          templateName: template.name,
          customerPhone: customer_phone,
          bookingNumber: booking_number,
          status: 'failed',
          errorMessage: error.message,
          payload
        });
        await messageLog.save();
      } catch (dbError) {
        console.log('MongoDB logging failed:', dbError.message);
      }
      throw error;
    }
  }

  // Maps payload fields to template variables in correct order
  mapVariables(payload, variableNames, brandConfig) {
    const mapping = {
      customer_name: payload.customer_name,
      booking_number: payload.booking_number,
      total_amount: payload.total_amount,
      discount_amount: payload.discount_amount,
      payable_amount: payload.payable_amount,
      invoice_amount: payload.invoice_amount,
      advance_paid: payload.advance_paid,
      balance_due: payload.balance_due,
      security_deposit: payload.security_deposit,
      security_amount: payload.security_amount,
      subtotal: payload.subtotal,
      brand_name: brandConfig.displayName,
      brand_contact: brandConfig.businessPhone
    };

    // Return array of values in template order
    return variableNames.map(varName => mapping[varName] || '');
  }
}

module.exports = new MessageService();
```

**Key concepts:**
- **Business logic layer** - Coordinates between database, config, and API
- **Error handling** - Try-catch blocks for graceful failures
- **Separation of concerns** - Each service has one job
- **Data mapping** - Transforms request data to API format

---

## 🎯 Step 8: API Routes

### 8.1 Create `routes/whatsapp.routes.js`
```javascript
const express = require('express');
const { body, validationResult } = require('express-validator');
const messageService = require('../services/message.service');

const router = express.Router();

// Validation rules
const validateSendMessage = [
  body('brand').isIn(['suitorguy', 'zorucci']).withMessage('Invalid brand'),
  body('event_type').isIn(['booking', 'rentout']).withMessage('Invalid event_type'),
  body('template_type').isIn(['withdiscount', 'nodisc']).withMessage('Invalid template_type'),
  body('customer_name').notEmpty().withMessage('customer_name is required'),
  body('customer_phone').notEmpty().withMessage('customer_phone is required'),
  body('booking_number').notEmpty().withMessage('booking_number is required'),
  body('total_amount').notEmpty().withMessage('total_amount is required'),
  body('advance_paid').notEmpty().withMessage('advance_paid is required'),
  body('balance_due').notEmpty().withMessage('balance_due is required')
];

// POST /whatsapp/send endpoint
router.post('/send', validateSendMessage, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Send message
    const result = await messageService.sendMessage(req.body);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'WhatsApp message sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Error sending message:', error);

    // Handle duplicate error
    if (error.message.includes('already sent')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: 'Failed to send WhatsApp message',
      error: error.message
    });
  }
});

module.exports = router;
```

**Key concepts:**
- **Router** - Groups related routes together
- **Validation middleware** - Checks data before processing
- **Error handling** - Different responses for different errors
- **HTTP status codes** - 200 (success), 400 (bad request), 500 (server error)

---

## 🎯 Step 9: Connect Routes to Server

### 9.1 Update `server.js`
```javascript
// Add this line after the basic route
app.use('/whatsapp', require('./routes/whatsapp.routes'));
```

**What this does:**
- Mounts the whatsapp routes at `/whatsapp` path
- So `router.post('/send')` becomes `POST /whatsapp/send`

---

## 🎯 Step 10: Testing Setup

### 10.1 Create `test-fresh.js`
```javascript
const axios = require('axios');

const API_URL = 'http://localhost:5000/whatsapp/send';
const timestamp = Date.now();

const tests = [
  {
    name: 'SuitorGuy - Booking with Discount',
    payload: {
      brand: 'suitorguy',
      event_type: 'booking',
      template_type: 'withdiscount',
      customer_name: 'John Doe',
      customer_phone: '918590292642',
      booking_number: `BK${timestamp}1`,
      total_amount: '5000',
      discount_amount: '500',
      payable_amount: '4500',
      advance_paid: '2000',
      balance_due: '2500'
    }
  }
  // ... more tests
];

async function runTests() {
  console.log('🚀 Starting API Tests...\n');

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const response = await axios.post(API_URL, test.payload);
      console.log('✅ Success:', response.data);
    } catch (error) {
      console.log('❌ Failed:', error.response?.data || error.message);
    }
    console.log('---\n');
  }

  console.log('✨ Tests completed!');
}

runTests();
```

---

## 🎯 Step 11: Run and Test

### 11.1 Start Server
```bash
npm run dev
```

### 11.2 Run Tests
```bash
node test-fresh.js
```

---

## 📚 Key Concepts Explained

### 1. **MVC Architecture**
```
Models (MongoDB schemas)
  ↓
Services (Business logic)
  ↓
Controllers (Routes)
  ↓
Views (JSON responses)
```

### 2. **Middleware**
Functions that run before your route handlers:
```javascript
app.use(cors());           // Runs for every request
app.use(express.json());   // Parses JSON bodies
```

### 3. **Async/Await**
Modern way to handle asynchronous operations:
```javascript
// Old way (callbacks)
mongoose.connect(uri, (err) => {
  if (err) console.error(err);
});

// New way (async/await)
try {
  await mongoose.connect(uri);
} catch (err) {
  console.error(err);
}
```

### 4. **Environment Variables**
Keep secrets out of code:
```javascript
// Bad
const token = 'EAAIxXzYDBZAwBO6eAeuzUdsA1dBV3Q...';

// Good
const token = process.env.ACCESS_TOKEN;
```

### 5. **Error Handling**
Always handle errors gracefully:
```javascript
try {
  await riskyOperation();
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
```

### 6. **Validation**
Never trust user input:
```javascript
body('brand').isIn(['suitorguy', 'zorucci'])
```

### 7. **Separation of Concerns**
Each file has one job:
- `server.js` - Start server
- `routes/` - Handle HTTP requests
- `services/` - Business logic
- `models/` - Database schemas
- `config/` - Configuration

---

## 🎓 Learning Path

### Beginner Level
1. ✅ Understand Node.js basics
2. ✅ Learn Express framework
3. ✅ Understand REST APIs
4. ✅ Learn MongoDB basics

### Intermediate Level
5. ✅ Understand middleware
6. ✅ Learn async/await
7. ✅ Understand error handling
8. ✅ Learn validation

### Advanced Level
9. ✅ Understand architecture patterns
10. ✅ Learn API integration
11. ✅ Understand security best practices
12. ✅ Learn deployment

---

## 📖 Resources to Learn More

### Node.js & Express
- [Node.js Official Docs](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### MongoDB
- [MongoDB University](https://university.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)

### JavaScript
- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [JavaScript.info](https://javascript.info/)

### API Development
- [REST API Tutorial](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)

---

## 🚀 Next Steps

1. **Learn by modifying:**
   - Add a new brand
   - Add a new template
   - Add email notifications

2. **Improve the code:**
   - Add rate limiting
   - Add authentication
   - Add webhook for delivery status

3. **Deploy to production:**
   - Learn Docker
   - Learn CI/CD
   - Learn monitoring

---

## ❓ Common Questions

**Q: Why use services instead of putting logic in routes?**
A: Separation of concerns. Routes handle HTTP, services handle business logic. Makes testing and reuse easier.

**Q: Why use environment variables?**
A: Security. Never commit secrets to Git. Easy to change per environment.

**Q: Why use MongoDB?**
A: NoSQL is flexible for logging. Easy to add fields without migrations.

**Q: Why use async/await?**
A: Cleaner than callbacks. Easier to read and debug.

**Q: Why validate input?**
A: Security and data quality. Never trust user input.

---

## 🎉 Congratulations!

You now understand how to build a production-ready Node.js backend with:
- Express API
- MongoDB integration
- External API integration (WhatsApp)
- Proper error handling
- Validation
- Testing
- Documentation

Keep learning and building! 🚀
