const axios = require('axios');
const whatsappConfig = require('../config/whatsapp.config');

class WhatsAppService {
  async sendTemplateMessage(brand, templateName, recipientPhone, variables, pdfUrl = null) {
    const brandConfig = whatsappConfig[brand];
    
    if (!brandConfig) {
      throw new Error(`Invalid brand: ${brand}`);
    }

    const url = `${whatsappConfig.apiUrl}/${brandConfig.phoneNumberId}/messages`;
    
    const components = [];

    // Add PDF header if provided
    if (pdfUrl) {
      components.push({
        type: 'header',
        parameters: [
          {
            type: 'document',
            document: {
              link: pdfUrl,
              filename: 'invoice.pdf'
            }
          }
        ]
      });
    }

    // Add body parameters if variables exist
    if (variables && variables.length > 0) {
      components.push({
        type: 'body',
        parameters: variables.map(value => ({
          type: 'text',
          text: String(value)
        }))
      });
    }

    const payload = {
      messaging_product: 'whatsapp',
      to: recipientPhone,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: 'en'
        },
        components: components
      }
    };

    try {
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

  async sendDocument(brand, recipientPhone, documentUrl, caption = '', filename = 'document.pdf') {
    const brandConfig = whatsappConfig[brand];
    
    if (!brandConfig) {
      throw new Error(`Invalid brand: ${brand}`);
    }

    const url = `${whatsappConfig.apiUrl}/${brandConfig.phoneNumberId}/messages`;
    
    const payload = {
      messaging_product: 'whatsapp',
      to: recipientPhone,
      type: 'document',
      document: {
        link: documentUrl,
        caption: caption,
        filename: filename
      }
    };

    try {
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
      throw new Error(error.response?.data?.error?.message || 'Failed to send document');
    }
  }
}

module.exports = new WhatsAppService();
