const fs = require('fs');
const path = require('path');
const swaggerSpec = require('./config/swagger.config');

/**
 * Script to export Swagger/OpenAPI specification to JSON file
 * 
 * Usage:
 *   node export-swagger.js
 * 
 * This creates a swagger.json file that can be shared with other developers
 */

const outputPath = path.join(__dirname, 'swagger.json');

try {
  fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), 'utf8');
  console.log('✅ Swagger specification exported successfully!');
  console.log(`📄 File saved to: ${outputPath}`);
  console.log('\n📤 You can now share this file with other developers.');
  console.log('   - Import into Postman');
  console.log('   - Import into Insomnia');
  console.log('   - Use with API code generators');
  console.log('   - Host on documentation sites');
} catch (error) {
  console.error('❌ Error exporting Swagger specification:', error.message);
  process.exit(1);
}
