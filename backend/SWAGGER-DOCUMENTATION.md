# Swagger API Documentation

## 📚 Access Swagger UI

Once your server is running, access the interactive Swagger documentation at:

**URL:** `http://localhost:5000/api-docs`

## 🚀 Quick Start

1. **Start your server:**
   ```bash
   npm run dev
   ```

2. **Open Swagger UI:**
   - Navigate to: `http://localhost:5000/api-docs`
   - You'll see all available APIs with interactive testing

3. **Test APIs directly:**
   - Click on any endpoint
   - Click "Try it out"
   - Fill in the request body
   - Click "Execute"
   - See the response

## 📋 Available Endpoints

### 1. Health Check
- **GET** `/`
- Returns API status and version

### 2. Send WhatsApp Message
- **POST** `/whatsapp/send`
- Sends WhatsApp notification to customer
- Supports:
  - Booking with/without discount
  - Rent-out with/without discount
  - Multiple brands (SuitorGuy, Zorucci)

## 📤 Export OpenAPI Specification

The OpenAPI specification is automatically generated and can be accessed at:

**JSON Format:** `http://localhost:5000/api-docs/swagger.json`

You can:
- Download this JSON file
- Import it into Postman
- Share it with other developers
- Use it with API testing tools

## 🔧 For Other Developers

### Import into Postman:
1. Open Postman
2. Click "Import"
3. Enter URL: `http://localhost:5000/api-docs/swagger.json`
4. All endpoints will be imported with examples

### Import into Insomnia:
1. Open Insomnia
2. Go to Application → Preferences → Data
3. Import from URL: `http://localhost:5000/api-docs/swagger.json`

### Use with Code Generators:
- Generate client SDKs using OpenAPI Generator
- Generate server stubs
- Generate API documentation

## 📝 API Examples

### Booking Without Discount
```json
{
  "brand": "suitorguy",
  "event_type": "booking",
  "template_type": "nodisc",
  "customer_name": "John Doe",
  "customer_phone": "918590292642",
  "booking_number": "BK12345",
  "total_amount": "5000",
  "discount_amount": "0",
  "payable_amount": "5000",
  "advance_paid": "2000",
  "balance_due": "3000"
}
```

### Booking With Discount
```json
{
  "brand": "suitorguy",
  "event_type": "booking",
  "template_type": "withdiscount",
  "customer_name": "Jane Smith",
  "customer_phone": "919876543210",
  "booking_number": "BK12346",
  "total_amount": "5000",
  "discount_amount": "500",
  "payable_amount": "4500",
  "advance_paid": "2000",
  "balance_due": "2500"
}
```

## 🔐 Authentication

Currently, the API doesn't require authentication. For production, you should:
- Add API key authentication
- Use JWT tokens
- Implement rate limiting

## 📦 Sharing with Other Teams

To share the API documentation:

1. **Option 1: Share Swagger UI URL**
   - Deploy your server
   - Share: `https://your-domain.com/api-docs`

2. **Option 2: Export OpenAPI Spec**
   - Access: `http://localhost:5000/api-docs/swagger.json`
   - Download the JSON file
   - Share the file with the team

3. **Option 3: Generate Documentation**
   - Use tools like Redoc or Swagger UI
   - Generate static HTML documentation
   - Host it on a documentation site

## 🛠️ Customization

To customize Swagger documentation, edit:
- `backend/config/swagger.config.js` - Main configuration
- Route files - Add `@swagger` comments for detailed docs

## 📞 Support

For API questions or issues, refer to:
- Swagger UI: `http://localhost:5000/api-docs`
- API Health Check: `http://localhost:5000/`
