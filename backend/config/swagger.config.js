const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WhatsApp Notification API',
      version: '1.0.0',
      description: 'API for sending automated WhatsApp messages for booking and rent-out confirmations',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.example.com',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        SendMessageRequest: {
          type: 'object',
          required: [
            'brand',
            'event_type',
            'template_type',
            'customer_name',
            'customer_phone',
            'booking_number',
            'total_amount',
            'advance_paid',
            'balance_due'
          ],
          properties: {
            brand: {
              type: 'string',
              enum: ['suitorguy', 'zorucci'],
              description: 'Brand name - SuitorGuy or Zorucci',
              example: 'suitorguy'
            },
            event_type: {
              type: 'string',
              enum: ['booking', 'rentout'],
              description: 'Type of event - booking or rentout',
              example: 'booking'
            },
            template_type: {
              type: 'string',
              enum: ['withdiscount', 'nodisc'],
              description: 'Template type - with discount or without discount',
              example: 'nodisc'
            },
            customer_name: {
              type: 'string',
              description: 'Customer full name',
              example: 'John Doe'
            },
            customer_phone: {
              type: 'string',
              description: 'Customer phone number with country code (no + sign)',
              example: '918590292642'
            },
            booking_number: {
              type: 'string',
              description: 'Unique booking or rent-out number',
              example: 'BK12345'
            },
            total_amount: {
              type: 'string',
              description: 'Total amount in rupees',
              example: '5000'
            },
            discount_amount: {
              type: 'string',
              description: 'Discount amount (required for withdiscount template)',
              example: '500'
            },
            payable_amount: {
              type: 'string',
              description: 'Amount payable after discount',
              example: '4500'
            },
            invoice_amount: {
              type: 'string',
              description: 'Invoice amount (for rentout events)',
              example: '7200'
            },
            advance_paid: {
              type: 'string',
              description: 'Advance amount paid',
              example: '2000'
            },
            balance_due: {
              type: 'string',
              description: 'Remaining balance to be paid',
              example: '2500'
            },
            security_deposit: {
              type: 'string',
              description: 'Security deposit amount (for rentout with discount)',
              example: '1000'
            },
            security_amount: {
              type: 'string',
              description: 'Security amount (for rentout without discount)',
              example: '1000'
            },
            subtotal: {
              type: 'string',
              description: 'Subtotal amount (for rentout events)',
              example: '8200'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'WhatsApp message sent successfully'
            },
            data: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true
                },
                messageId: {
                  type: 'string',
                  description: 'WhatsApp message ID from Meta API',
                  example: 'wamid.HBgMOTE4NTkwMjkyNjQyFQIAERgSOTM4QTQ0MjFENzA4OUM2RTIzAA=='
                },
                bookingNumber: {
                  type: 'string',
                  example: 'BK12345'
                }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Failed to send WhatsApp message'
            },
            error: {
              type: 'string',
              example: 'Error message details'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: {
                    type: 'string'
                  },
                  param: {
                    type: 'string'
                  },
                  location: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'WhatsApp Notification Backend API'
            },
            version: {
              type: 'string',
              example: '1.0.0'
            },
            status: {
              type: 'string',
              example: 'running'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints'
      },
      {
        name: 'WhatsApp',
        description: 'WhatsApp message sending endpoints'
      }
    ]
  },
  apis: ['./routes/*.js', './server.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
