# Quick Start: Connect Your Meta Template

## 🚀 3-Step Quick Guide

### Step 1: List Your Meta Templates

```bash
# See all your approved templates
node list-meta-templates.js suitorguy
node list-meta-templates.js zorucci
```

This shows you:
- ✅ Exact template names (copy these!)
- ✅ Template status
- ✅ Number of variables

### Step 2: Update Template Name

**Option A: Interactive Update**
```bash
node update-template-name.js
```
Follow the prompts to update your template name.

**Option B: Manual Update**
1. Open `config/templates.config.js`
2. Find the template you want to update
3. Change the `name` field to match your Meta template name exactly

Example:
```javascript
booking: {
  withdiscount: {
    name: 'your_meta_template_name_here',  // ← Change this!
    variables: [...]
  }
}
```

### Step 3: Test It!

```bash
# Test with your real phone number
node test-real-template.js
```

## ✅ Checklist

- [ ] Templates listed from Meta (`list-meta-templates.js`)
- [ ] Template name updated in `templates.config.js`
- [ ] Variable count matches Meta template
- [ ] Variable order matches Meta template
- [ ] Tested with real phone number

## 📚 Need More Help?

- **Detailed Guide:** See [CONNECT-META-TEMPLATE.md](./CONNECT-META-TEMPLATE.md)
- **Testing Guide:** See [TESTING.md](./TESTING.md)

## 🔍 Common Issues

**"Template not found"**
→ Template name doesn't match exactly (case-sensitive!)

**"Variable mismatch"**
→ Count or order of variables doesn't match Meta template

**"Template not approved"**
→ Template must be APPROVED in Meta Business Manager
