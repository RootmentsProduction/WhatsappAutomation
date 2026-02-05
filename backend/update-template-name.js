const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Helper script to update template names in templates.config.js
 * 
 * Usage:
 *   node update-template-name.js
 */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

const configPath = path.join(__dirname, 'config', 'templates.config.js');

async function updateTemplateName() {
  console.log('\n🔧 Template Name Updater\n');
  console.log('=' .repeat(50));
  
  // Read current config
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  // Show current template names
  console.log('\nCurrent Template Names:');
  const matches = configContent.match(/name:\s*['"]([^'"]+)['"]/g);
  if (matches) {
    matches.forEach((match, index) => {
      const name = match.match(/['"]([^'"]+)['"]/)[1];
      console.log(`  ${index + 1}. ${name}`);
    });
  }
  
  console.log('\nWhich template do you want to update?');
  console.log('1. Booking with Discount');
  console.log('2. Booking without Discount');
  console.log('3. Rent-out with Discount');
  console.log('4. Rent-out without Discount');
  
  const choice = await askQuestion('\nSelect (1-4): ');
  
  let templatePath;
  let templateType;
  
  switch(choice) {
    case '1':
      templatePath = 'booking.withdiscount.name';
      templateType = 'Booking with Discount';
      break;
    case '2':
      templatePath = 'booking.nodisc.name';
      templateType = 'Booking without Discount';
      break;
    case '3':
      templatePath = 'rentout.withdiscount.name';
      templateType = 'Rent-out with Discount';
      break;
    case '4':
      templatePath = 'rentout.nodisc.name';
      templateType = 'Rent-out without Discount';
      break;
    default:
      console.log('❌ Invalid choice!');
      rl.close();
      return;
  }
  
  // Get current name
  const currentMatch = configContent.match(/booking:\s*\{[^}]*withdiscount:\s*\{[^}]*name:\s*['"]([^'"]+)['"]/);
  let currentName = 'N/A';
  if (choice === '1') {
    const match = configContent.match(/booking:\s*\{[^}]*withdiscount:\s*\{[^}]*name:\s*['"]([^'"]+)['"]/);
    if (match) currentName = match[1];
  } else if (choice === '2') {
    const match = configContent.match(/booking:\s*\{[^}]*nodisc:\s*\{[^}]*name:\s*['"]([^'"]+)['"]/);
    if (match) currentName = match[1];
  } else if (choice === '3') {
    const match = configContent.match(/rentout:\s*\{[^}]*withdiscount:\s*\{[^}]*name:\s*['"]([^'"]+)['"]/);
    if (match) currentName = match[1];
  } else if (choice === '4') {
    const match = configContent.match(/rentout:\s*\{[^}]*nodisc:\s*\{[^}]*name:\s*['"]([^'"]+)['"]/);
    if (match) currentName = match[1];
  }
  
  console.log(`\nCurrent name: ${currentName}`);
  console.log(`\n💡 Get your template name from Meta Business Manager or run:`);
  console.log(`   node list-meta-templates.js suitorguy`);
  
  const newName = await askQuestion('\nEnter new Meta template name: ');
  
  if (!newName || newName.trim() === '') {
    console.log('❌ Template name cannot be empty!');
    rl.close();
    return;
  }
  
  // Update the template name
  let updatedContent = configContent;
  
  if (choice === '1') {
    updatedContent = updatedContent.replace(
      /(booking:\s*\{[^}]*withdiscount:\s*\{[^}]*name:\s*['"])([^'"]+)(['"])/,
      `$1${newName.trim()}$3`
    );
  } else if (choice === '2') {
    updatedContent = updatedContent.replace(
      /(booking:\s*\{[^}]*nodisc:\s*\{[^}]*name:\s*['"])([^'"]+)(['"])/,
      `$1${newName.trim()}$3`
    );
  } else if (choice === '3') {
    updatedContent = updatedContent.replace(
      /(rentout:\s*\{[^}]*withdiscount:\s*\{[^}]*name:\s*['"])([^'"]+)(['"])/,
      `$1${newName.trim()}$3`
    );
  } else if (choice === '4') {
    updatedContent = updatedContent.replace(
      /(rentout:\s*\{[^}]*nodisc:\s*\{[^}]*name:\s*['"])([^'"]+)(['"])/,
      `$1${newName.trim()}$3`
    );
  }
  
  // Write back to file
  fs.writeFileSync(configPath, updatedContent, 'utf8');
  
  console.log(`\n✅ Updated ${templateType} template name to: ${newName.trim()}`);
  console.log('\n📝 Next steps:');
  console.log('1. Verify variable count matches your Meta template');
  console.log('2. Test with: node test-simple.js <phone> <template_number>');
  console.log('3. Check CONNECT-META-TEMPLATE.md for more details');
  
  rl.close();
}

updateTemplateName().catch(console.error);
