# 🚀 Netlify Deployment Guide

## Step-by-Step Setup (5 minutes)

### Step 1: Deploy to Netlify

1. **Go to Netlify**: https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub**
4. Select repository: **`pingou100/vantys-website`**
5. Settings will be auto-detected from `netlify.toml`
6. Click **"Deploy site"**

Your site will be live in ~30 seconds at a URL like: `https://random-name-123456.netlify.app`

---

### Step 2: Enable Content Management (CMS)

#### 2.1 Enable Netlify Identity

1. In Netlify dashboard, go to **Site settings** → **Identity**
2. Click **"Enable Identity"**
3. Under **Registration preferences**:
   - Select **"Invite only"** (recommended for security)
4. Under **Services** → **Git Gateway**:
   - Click **"Enable Git Gateway"**

#### 2.2 Invite Yourself as Admin

1. Still in **Identity** tab
2. Click **"Invite users"**
3. Enter your email address
4. Check your email inbox
5. Click the invitation link
6. Set your password

---

### Step 3: Access Your CMS

Go to: `https://your-site-name.netlify.app/admin/`

Login with your email and password.

**🎉 You're done!** You can now edit content visually.

---

## 📝 How to Edit Content

### Using the CMS Interface (You)

1. Go to `https://your-site-name.netlify.app/admin/`
2. Click **"Pages"** → **"Homepage"**
3. Edit any section you want
4. Click **"Save"**
5. Click **"Publish"** (or **"Publish now"** in the workflow tab)
6. Changes appear live in ~1 minute

### What You Can Edit:

- ✏️ All text content (headings, paragraphs, button text)
- 🎨 Colors (in Site Settings)
- 🔗 Links and URLs
- 📄 Add/remove/reorder sections

---

## 🎯 Custom Domain (Optional)

### Option 1: Use Your Existing Domain

1. Go to **Domain settings** in Netlify
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `vantys.com`)
4. Follow DNS configuration instructions
5. Netlify provides free SSL automatically

### Option 2: Buy a New Domain

1. Buy from Namecheap, GoDaddy, etc.
2. Follow Option 1 above

**Recommended domains:**
- `vantys.com`
- `vantys.consulting`
- `vantysconsulting.com`

---

## 🛠️ Advanced: How Claude Can Edit

I can edit content and CSS directly via GitHub:

```javascript
// Edit content
github:create_or_update_file({
  repo: "vantys-website",
  path: "content/homepage.json",
  content: "{ ... }", // Updated content
  message: "Update hero section text"
})

// Edit CSS
github:create_or_update_file({
  repo: "vantys-website",
  path: "styles.css",
  content: "...", // Updated styles
  message: "Adjust button colors"
})
```

Changes sync to Netlify automatically.

---

## 🔧 Troubleshooting

### CMS Login Not Working

**Check:**
- ✅ Netlify Identity is enabled
- ✅ Git Gateway is enabled
- ✅ You accepted the email invitation
- ✅ You're using the correct email/password

**Solution:** Go to Identity tab → Invite users again

---

### Changes Not Appearing

**Check:**
1. Netlify **Deploys** tab → Ensure latest deploy succeeded
2. Wait 1-2 minutes (build + CDN propagation)
3. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

---

### Build Failed

**Check Netlify deploy logs:**
1. Go to **Deploys** tab
2. Click failed deploy
3. Read error message
4. Ask Claude for help with the error

---

## 📞 Need Help?

Just ask Claude in chat! I have full access to:
- ✅ Edit all files via GitHub
- ✅ Fix CSS issues
- ✅ Update content structure
- ✅ Troubleshoot deployment problems
- ✅ Add new features

---

## ✅ Current Status Checklist

- [x] Repository created
- [x] All files uploaded
- [x] CMS configured
- [ ] **Deploy to Netlify** ← Do this now
- [ ] Enable Identity & Git Gateway
- [ ] Invite yourself as admin
- [ ] Login to CMS and test
- [ ] (Optional) Add custom domain

---

**Ready to deploy?** Start with Step 1 above! 🚀