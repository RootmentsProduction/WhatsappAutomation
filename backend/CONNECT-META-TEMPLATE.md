# How to Connect Your Meta Template Message

This guide will help you connect your approved WhatsApp template from Meta Business Manager to this system.

## Step 1: Find Your Template Name from Meta

### Option A: Using the Script (Recommended)

Run this script to list all your approved templates:

```bash
# For SuitorGuy
node list-meta-templates.js suitorguy

# For Zorucci
node list-meta-templates.js zorucci
```

This will show you:
- Template names (exact name to use)
- Template status
- Number of variables
- Template preview

### Option B: From Meta Business Manager

1. Go to [Meta Business Manager](https://business.facebook.com)
2. Navigate to **WhatsApp Accounts** → **Message Templates**
3. Find your approved template
4. Copy the **exact template name** (it's case-sensitive)

**Important:** The template name in Meta might look like:
- `booking_summary_withdiscount`
- `booking_summary_nodisc`
- `rentout_summary_withdiscount`
- `rentout_summary_nodisc`

Or it might be something completely different like:
- `booking_confirmation`
- `order_summary`
- `rental_notification`

## Step 2: Check Your Template Variables

Your Meta template has variables (placeholders like `{{1}}`, `{{2}}`, etc.). You need to make sure:

1. **Variable count matches** - Count how many `{{1}}`, `{{2}}`, etc. in your Meta template
2. **Variable order matches** - The order matters!

### Example:

If your Meta template body is:
```
Hello {{1}}, your booking {{2}} is confirmed. 
Total: ₹{{3}}, Discount: ₹{{4}}, Payable: ₹{{5}}
```

Then you need **5 variables** in this exact order:
1. Customer name
2. Booking number
3. Total amount
4. Discount amount
5. Payable amount

## Step 3: Update Your Template Configuration

Edit `config/templates.config.js` and update the template name:

```javascript
module.exports = {
  booking: {
    withdiscount: {
      name: 'YOUR_META_TEMPLATE_NAME_HERE',  // ← Change this!
      variables: [
        'customer_name',      // Maps to {{1}}
        'booking_number',     // Maps to {{2}}
        'total_amount',       // Maps to {{3}}
        // ... etc
      ]
    },
    // ...
  }
};
```

### Important Notes:

1. **Template name must match exactly** (case-sensitive, no spaces)
2. **Variable order must match** your Meta template
3. **Variable count must match** your Meta template

## Step 4: Match Variables to Your Meta Template

The system maps variables in this order:

| Position | Variable Name | Example Value |
|----------|--------------|---------------|
| 1 | customer_name | "John Doe" |
| 2 | booking_number | "BK12345" |
| 3 | total_amount | "5000" |
| 4 | discount_amount | "500" |
| 5 | payable_amount | "4500" |
| 6 | advance_paid | "2000" |
| 7 | balance_due | "2500" |
| 8 | brand_name | "SuitorGuy" |
| 9 | brand_contact | "8943300097" |

**Your Meta template variables must be in the same order!**

### Example Mapping:

If your Meta template is:
```
Hello {{1}}, 
Booking: {{2}}
Total: ₹{{3}}, Discount: ₹{{4}}, Payable: ₹{{5}}
Advance: ₹{{6}}, Balance: ₹{{7}}
Contact: {{8}} - {{9}}
```

Your `templates.config.js` should be:
```javascript
variables: [
  'customer_name',      // {{1}}
  'booking_number',     // {{2}}
  'total_amount',       // {{3}}
  'discount_amount',    // {{4}}
  'payable_amount',     // {{5}}
  'advance_paid',       // {{6}}
  'balance_due',        // {{7}}
  'brand_name',         // {{8}}
  'brand_contact'       // {{9}}
]
```

## Step 5: Test Your Template

After updating the config, test it:

```bash
# Interactive test
node test-real-template.js

# Or quick test
node test-simple.js 919876543210 1
```

## Common Issues

### Issue: "Template not found" or "Invalid template"

**Solution:**
- Check template name matches exactly (case-sensitive)
- Make sure template is **APPROVED** in Meta Business Manager
- Template must be in the same WhatsApp Business Account

### Issue: "Variable count mismatch"

**Solution:**
- Count variables in your Meta template (`{{1}}`, `{{2}}`, etc.)
- Make sure `variables` array in config has same count
- Check variable order matches

### Issue: "Wrong data in template"

**Solution:**
- Variable order is wrong - reorder the `variables` array
- Check which variable maps to which `{{number}}` in Meta

## Quick Reference

### Current Template Names (Default)

These are the default names. Update them to match your Meta templates:

- `booking_summary_withdiscount` → Your Meta template name
- `booking_summary_nodisc` → Your Meta template name
- `rentout_summary_withdiscount` → Your Meta template name
- `rentout_summary_nodisc` → Your Meta template name

### Available Variables

You can use these variable names in your config:

- `customer_name`
- `booking_number`
- `total_amount`
- `discount_amount`
- `payable_amount`
- `invoice_amount`
- `advance_paid`
- `balance_due`
- `security_deposit`
- `security_amount`
- `subtotal`
- `brand_name` (auto-filled from config)
- `brand_contact` (auto-filled from config)

## Need Help?

1. **List your templates:** `node list-meta-templates.js suitorguy`
2. **Check template details** in Meta Business Manager
3. **Count variables** in your template body
4. **Update config** with exact template name
5. **Test** with real phone number
