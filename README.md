# VANTYS Website

Pharmaceutical Operations Consulting website with Decap CMS for easy content management.

## 🚀 Quick Setup

### 1. Deploy to Netlify

Click the button below to deploy this site to Netlify (it's free):

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/pingou100/vantys-website)

**OR** Manual setup:

1. Log in to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select `pingou100/vantys-website`
4. Click "Deploy site"

### 2. Enable Netlify Identity

1. In your Netlify dashboard, go to **Site settings** → **Identity**
2. Click **Enable Identity**
3. Under **Registration preferences**, select **Invite only** (recommended)
4. Under **External providers**, you can enable GitHub or Google login (optional)
5. Scroll to **Services** → **Git Gateway** and click **Enable Git Gateway**

### 3. Invite Yourself as Admin

1. Go to **Identity** tab in Netlify dashboard
2. Click **Invite users**
3. Enter your email address
4. Check your email and accept the invitation
5. Set your password

### 4. Access the CMS

Once your site is deployed, you can access the CMS at:

```
https://your-site-name.netlify.app/admin/
```

Login with your email and password.

## ✏️ Editing Content

### For You (WYSIWYG Interface)

1. Go to `https://your-site-name.netlify.app/admin/`
2. Login with your credentials
3. Click on "Pages" → "Homepage"
4. Edit any section:
   - Hero Section (main title and subtitle)
   - Challenge Section (the 3 challenges)
   - Services Section (the 3 services)
   - Approach Section (how you work)
   - Final CTA Section
   - Footer

5. Click **Save** → **Publish** (or **Publish now** in the workflow)
6. Changes will appear on your live site in ~1 minute

### For Claude (Direct File Editing)

I can edit content directly via GitHub:

```bash
# Edit content
github:create_or_update_file(
  path="content/homepage.json",
  content="{...}",
  ...
)

# Edit CSS
github:create_or_update_file(
  path="styles.css",
  content="...",
  ...
)
```

Changes sync automatically to Netlify.

## 🎨 Editing Styles

### CSS Variables (Colors)

All colors are defined in `styles.css`:

```css
:root {
    --navy: #314969;
    --coral: #F07B4A;
    --golden: #F2AF4C;
    --gray: #697A92;
    --warm-neutral: #F5F3F0;
    --white: #FFFFFF;
}
```

You can edit these in the CMS under **Site Settings** → **General Settings** → **Colors**

Or I can edit them directly in the CSS file.

## 📁 Project Structure

```
vantys-website/
├── index.html              # Main website HTML
├── styles.css              # All styling
├── script.js               # Interactive features
├── admin/
│   ├── index.html         # CMS interface
│   └── config.yml         # CMS configuration
├── content/
│   ├── homepage.json      # Content data
│   └── settings.json      # Site settings
└── images/
    └── uploads/           # Uploaded images
```

## 🔧 Advanced Customization

### Adding a New Section

1. Edit `content/homepage.json` to add content
2. Edit `index.html` to add HTML structure
3. Edit `styles.css` to add styling
4. (Optional) Update `admin/config.yml` to add CMS fields

### Custom Domain

1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In Netlify: **Domain settings** → **Add custom domain**
3. Follow the DNS configuration instructions
4. Netlify provides free SSL certificates automatically

## 🆘 Troubleshooting

### CMS Login Issues

- Make sure Netlify Identity is enabled
- Check that Git Gateway is enabled
- Verify your invitation email

### Changes Not Appearing

- Check the **Deploys** tab in Netlify to ensure build succeeded
- CMS changes may take 1-2 minutes to appear
- Clear your browser cache

### Need Help?

Just ask Claude! I have full access to edit this repository.

## 📊 Current Status

- ✅ Repository created
- ✅ All files uploaded
- ✅ CMS configured
- ⏳ **Next:** Deploy to Netlify (see instructions above)

## 🎯 What You Get

- **WYSIWYG editing** via web interface at `/admin/`
- **No coding needed** for content updates
- **Free hosting** on Netlify
- **Automatic deploys** when you save changes
- **Fast & secure** with global CDN
- **Mobile responsive** design
- **Claude can edit** directly via GitHub

---

Made with ❤️ by Claude & Olivier