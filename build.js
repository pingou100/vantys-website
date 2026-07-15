const fs = require('fs');
const path = require('path');

// ─── Markdown → HTML ──────────────────────────────────────────────────────
function markdownToHtml(text) {
    if (!text) return '';
    return text
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/__([^_]+)__/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/_([^_]+)_/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ─── Read content JSON ──────────────────────────────────────────────────────
const homepageContent  = JSON.parse(fs.readFileSync(path.join(__dirname, 'content', 'homepage.json'), 'utf8'));
const aboutContent     = JSON.parse(fs.readFileSync(path.join(__dirname, 'content', 'about-me.json'), 'utf8'));
const contactContent   = JSON.parse(fs.readFileSync(path.join(__dirname, 'content', 'contact.json'), 'utf8'));
const csIndexContent   = JSON.parse(fs.readFileSync(path.join(__dirname, 'content', 'case-studies-index.json'), 'utf8'));
const navigationContent = JSON.parse(fs.readFileSync(path.join(__dirname, 'content', 'navigation.json'), 'utf8'));
const blogSettingsPath = path.join(__dirname, 'content', 'blog-settings.json');
const blogSettings = fs.existsSync(blogSettingsPath)
    ? JSON.parse(fs.readFileSync(blogSettingsPath, 'utf8'))
    : { title: 'Insights & Perspectives', subtitle: 'Reflections on commercial strategy, operations and innovation in Life Sciences.' };

// ─── Shared fragments ───────────────────────────────────────────────────────
const LOGO_SVG = `<svg class="logo-icon" width="50" height="40" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2"  y="10" width="5" height="14" rx="2.5" fill="#F07B4A"/>
    <rect x="9"  y="4"  width="5" height="24" rx="2.5" fill="#314969"/>
    <rect x="16" y="6"  width="5" height="20" rx="2.5" fill="#F07B4A"/>
    <rect x="23" y="6"  width="5" height="20" rx="2.5" fill="#F2AF4C"/>
    <rect x="30" y="10" width="5" height="14" rx="2.5" fill="#F07B4A"/>
</svg>`;

const BACK_TO_TOP = `<div class="back-to-top" id="backToTop">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</div>`;

const FAVICON_LINKS = `    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`;

const BASE_URL = 'https://www.vantys.be';
// ─── Cloudflare Web Analytics ────────────────────────────────────────────────
const CF_ANALYTICS = `    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "da816b01ffb04a1cbd4e6b36a83e22ed"}'></script><!-- End Cloudflare Web Analytics -->`;
// ─── SEO helpers ────────────────────────────────────────────────────────────
function seoHead({ title, description, canonical, schema, image, type = 'website' } = {}) {
    const parts = [];
    if (description) parts.push(`    <meta name="description" content="${description}">`);
    if (canonical)   parts.push(`    <link rel="canonical" href="${BASE_URL}${canonical}">`);
    const ogTitle = title || 'VANTYS';
    const ogUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
    const ogImage = image
        ? (image.startsWith('http') ? image : `${BASE_URL}${image}`)
        : `${BASE_URL}/images/og-image.png`;
    parts.push(`    <meta property="og:type" content="${type}">`);
    parts.push(`    <meta property="og:title" content="${ogTitle}">`);
    if (description) parts.push(`    <meta property="og:description" content="${description}">`);
    parts.push(`    <meta property="og:url" content="${ogUrl}">`);
    parts.push(`    <meta property="og:site_name" content="Vantys">`);
    parts.push(`    <meta property="og:image" content="${ogImage}">`);
    parts.push(`    <meta name="twitter:card" content="summary_large_image">`);
    parts.push(`    <meta name="twitter:title" content="${ogTitle}">`);
    if (description) parts.push(`    <meta name="twitter:description" content="${description}">`);
    parts.push(`    <meta name="twitter:image" content="${ogImage}">`);
    if (schema)      parts.push(`    <script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n    </script>`);
    return parts.join('\n');
}

const SCHEMA_ORG_BASE = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Vantys",
    "legalName": "Vantys SRL",
    "url": BASE_URL,
    "logo": `${BASE_URL}/favicon.svg`,
    "description": "Senior-led life science advisory specialising in commercial transformation, digital & AI implementation, and healthcare system navigation for pharma, biotech, and medical devices.",
    "founder": {
        "@type": "Person",
        "name": "Olivier Delannoy",
        "jobTitle": "Founder & Managing Director",
        "sameAs": "https://www.linkedin.com/in/olivierdelannoy/"
    },
    "areaServed": "Europe",
    "knowsAbout": [
        "Pharmaceutical commercial strategy",
        "Life science digital transformation",
        "Omnichannel HCP engagement",
        "AI implementation in pharma",
        "Healthcare system navigation",
        "Medical affairs operations"
    ],
    "address": { "@type": "PostalAddress", "addressCountry": "BE" },
    "sameAs": ["https://www.linkedin.com/company/vantys"]
};

// ─── Navigation ───────────────────────────────────────────────────────
function navHtml(prefix = '') {
    const navItems = navigationContent.items || [];
    const items = navItems.map(link => {
        let href = link.href;
        if (href.startsWith('/')) {
            href = prefix ? prefix + href.replace(/^\//, '') : href;
        }
        return `<li><a href="${href}">${link.label}</a></li>`;
    }).join('\n                ');

    return `<header>
    <nav class="container">
        <div class="logo-container">
            ${LOGO_SVG}
            <a href="${prefix}index.html" style="text-decoration:none" class="logo">vantys</a>
        </div>
        <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle menu">
            <span></span><span></span><span></span>
        </button>
        <ul class="nav-links">
            ${items}
        </ul>
    </nav>
</header>`;
}

function footerHtml(prefix = '') {
    const LOGO_SVG_WHITE = `<svg width="44" height="36" viewBox="0 0 226 168" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0"   y="37" width="36" height="94"  rx="18"   fill="#F27B41"/>
        <rect x="45"  y="0"  width="41" height="168" rx="20.5" fill="white"/>
        <rect x="94"  y="13" width="41" height="142" rx="20.5" fill="#F27B41"/>
        <rect x="142" y="0"  width="41" height="168" rx="20.5" fill="#F4B041"/>
        <rect x="190" y="37" width="36" height="94"  rx="18"   fill="#F27B41"/>
    </svg>`;
    return `<footer>
    <div class="container footer-inner">
        <div class="footer-brand">
            ${LOGO_SVG_WHITE}
            <span class="footer-brand-name">vantys</span>
        </div>
        <nav class="footer-nav" aria-label="Footer navigation">
            <a href="${prefix}index.html#services">Services</a>
            <a href="${prefix}index.html#approach">Approach</a>
            <a href="${prefix}case-studies/">Case Studies</a>
            <a href="${prefix}blog/">Blog</a>
            <a href="${prefix}about-me.html">About</a>
            <a href="${prefix}contact.html">Contact</a>
        </nav>
        <div class="footer-meta">
            <p>&copy; 2026 Vantys SRL</p>
            <p class="footer-links"><a href="${homepageContent.footer.linkedinUrl}" target="_blank" rel="noopener">LinkedIn</a> <span class="footer-sep">&middot;</span> <a href="${prefix}privacy-policy.html">Privacy Policy</a></p>
        </div>
    </div>
</footer>`;
}

// ─── PAGE: index.html ───────────────────────────────────────────────────────
let heroTitle = homepageContent.hero.title && homepageContent.hero.title.trim()
    ? `${homepageContent.hero.title} <strong>${homepageContent.hero.titleHighlight}</strong>`
    : `<strong>${homepageContent.hero.titleHighlight}</strong>`;

const serviceIcons = [
    `<svg width="100" height="100" viewBox="0 0 100 100" fill="none"><rect x="30" y="30" width="40" height="40" stroke="#697A92" stroke-width="1.5" fill="none" opacity="0.3"/><rect x="25" y="25" width="50" height="50" stroke="#314969" stroke-width="1.5" fill="none" opacity="0.6"/><rect class="vty-ripple" x="20" y="20" width="60" height="60" stroke="#F07B4A" stroke-width="2.5" fill="none"/></svg>`,
    `<svg width="100" height="100" viewBox="0 0 100 100" fill="none"><defs><clipPath id="lc"><circle cx="40" cy="50" r="25"/></clipPath><clipPath id="rc"><circle cx="60" cy="50" r="25"/></clipPath></defs><circle class="vty-lens" cx="40" cy="50" r="25" fill="#F07B4A" clip-path="url(#rc)"/><circle cx="40" cy="50" r="25" fill="none" stroke="#314969" stroke-width="2"/><circle cx="60" cy="50" r="25" fill="none" stroke="#314969" stroke-width="2"/></svg>`,
    `<svg width="100" height="100" viewBox="0 0 100 100" fill="none"><line id="vtyI3Bottom" x1="20" y1="65" x2="60" y2="65" stroke="#697A92" stroke-width="1.5" opacity="0.7"/><line id="vtyI3Mid" x1="20" y1="50" x2="70" y2="50" stroke="#314969" stroke-width="1.5" opacity="0.85"/><line id="vtyI3Top" x1="20" y1="35" x2="80" y2="35" stroke="#F07B4A" stroke-width="2.5"/><circle id="vtyI3Dot" cx="80" cy="35" r="3.4" fill="#F07B4A" style="transform-box:fill-box;transform-origin:center"/></svg>`,
];
const approachIcons = [
    `<svg width="100" height="100" viewBox="0 0 100 100" fill="none"><rect class="vty-build" x="30" y="30" width="20" height="20" stroke="#697A92" stroke-width="1.5" fill="none" opacity="0.4"/><rect class="vty-build d1" x="30" y="30" width="35" height="35" stroke="#314969" stroke-width="1.5" fill="none" opacity="0.7"/><rect class="vty-build d2" x="30" y="30" width="50" height="50" stroke="#F07B4A" stroke-width="2.5" fill="none"/></svg>`,
    `<svg width="100" height="100" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="15" stroke="#697A92" stroke-width="1.5" fill="none" opacity="0.4"/><circle cx="50" cy="50" r="25" stroke="#314969" stroke-width="1.5" fill="none" opacity="0.7"/><circle class="vty-ping" cx="50" cy="50" r="35" stroke="#F07B4A" stroke-width="2.5" fill="none"/></svg>`,
    `<svg width="100" height="100" viewBox="0 0 100 100" fill="none"><rect class="vty-bar1" x="25" y="60" width="15" height="20" stroke="#697A92" stroke-width="1.5" fill="none" opacity="0.6"/><rect class="vty-bar2" x="45" y="50" width="15" height="30" stroke="#314969" stroke-width="1.5" fill="none" opacity="0.8"/><rect class="vty-bar3" x="65" y="30" width="15" height="50" stroke="#F07B4A" stroke-width="2.5" fill="none"/><line x1="20" y1="80" x2="85" y2="80" stroke="#314969" stroke-width="1.5" opacity="0.3"/></svg>`,
];

const proofSectionHtml = homepageContent.proof ? `<section class="proof-section">
    <div class="container">
        <div class="section-header section-header--light">
            <h2 class="proof-title">${homepageContent.proof.title}</h2>
            <p class="proof-subtitle">(More details in the use cases)</p>
        </div>
        <div class="proof-grid">
            ${homepageContent.proof.items.map(item => `<div class="proof-stat">
                <span class="proof-number">${item.stat}</span>
                <span class="proof-label">${item.label}</span>
            </div>`).join('\n            ')}
        </div>
    </div>
</section>` : '';

const INDEX_DESC = 'Senior-led life science advisory helping pharma, biotech and medical devices companies bridge strategy and execution. 30 years of experience. Measurable outcomes.';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VANTYS | Life Science Strategy, Executed</title>
${FAVICON_LINKS}
${seoHead({ title: 'VANTYS | Life Science Strategy, Executed', description: INDEX_DESC, canonical: '/', schema: SCHEMA_ORG_BASE })}
    <link rel="stylesheet" href="styles.css">
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
${CF_ANALYTICS}
</head>
<body>
${BACK_TO_TOP}
${navHtml('')}
<section class="hero">
    <canvas class="hero-wave" id="heroWave" aria-hidden="true"></canvas>
    <div class="container">
        <h1>${heroTitle}</h1>
        <p>${markdownToHtml(homepageContent.hero.description)}</p>
        <a href="${homepageContent.hero.ctaLink}" class="cta-button">${homepageContent.hero.ctaText}</a>
    </div>
</section>
<section class="challenge" id="challenge">
    <div class="bg-shape bg-shape-1"></div><div class="bg-shape bg-shape-2"></div>
    <div class="container">
        <h2>${homepageContent.challenge.title}</h2>
        <div class="challenge-grid">
            ${homepageContent.challenge.items.map(item => `<div class="challenge-item"><h3>${item.title}</h3><p>${markdownToHtml(item.description)}</p></div>`).join('\n            ')}
        </div>
    </div>
</section>
<section class="services" id="services">
    <div class="bg-shape bg-shape-1"></div><div class="bg-shape bg-shape-2"></div><div class="bg-shape bg-shape-3"></div>
    <div class="container">
        <div class="section-header"><h2>${homepageContent.services.title}</h2><p>${homepageContent.services.subtitle}</p></div>
        <div class="services-grid">
            ${homepageContent.services.items.map((item, i) => `<div class="service-card"><div class="icon-container">${serviceIcons[i] || serviceIcons[0]}</div><h3>${item.title}</h3><p>${markdownToHtml(item.description)}</p></div>`).join('\n            ')}
        </div>
    </div>
</section>
${proofSectionHtml}
<section class="approach" id="approach">
    <div class="bg-shape bg-shape-1"></div><div class="bg-shape bg-shape-2"></div><div class="bg-shape bg-shape-3"></div>
    <div class="container">
        <div class="section-header"><h2>${homepageContent.approach.title}</h2><p>${homepageContent.approach.subtitle}</p></div>
        <div class="services-grid">
            ${homepageContent.approach.items.map((item, i) => `<div class="service-card"><div class="icon-container">${approachIcons[i] || approachIcons[0]}</div><h3>${item.title}</h3><p>${markdownToHtml(item.description)}</p></div>`).join('\n            ')}
        </div>
    </div>
</section>
<section class="cta-section">
    <div class="bg-shape bg-shape-1"></div><div class="bg-shape bg-shape-2"></div><div class="bg-shape bg-shape-3"></div>
    <div class="container">
        <h2>${homepageContent.cta.title}</h2>
        <p>${markdownToHtml(homepageContent.cta.description)}</p>
        <a href="${homepageContent.cta.buttonLink}" class="cta-button">${homepageContent.cta.buttonText}</a>
    </div>
</section>
${footerHtml('')}
<script src="script.js"></script>
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', user => { if (!user) { window.netlifyIdentity.on('login', () => { document.location.href = '/admin/'; }); } });
  }
</script>
</body>
</html>`;

// ─── PAGE: about-me.html ────────────────────────────────────────────────────
const ABOUT_DESC = 'Olivier Delannoy — 30 years in life sciences including senior roles at AstraZeneca and Amarin. Founder of Vantys, a strategic advisory firm for pharma, biotech and medtech transformation.';
const aboutHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${aboutContent.title} | VANTYS</title>
${FAVICON_LINKS}
${seoHead({ title: `${aboutContent.title} | VANTYS`, description: ABOUT_DESC, canonical: '/about-me', image: aboutContent.photo })}
    <link rel="stylesheet" href="styles.css">
${CF_ANALYTICS}
</head>
<body>
${BACK_TO_TOP}
${navHtml('')}
<section class="hero">
    <div class="bg-shape bg-shape-1"></div><div class="bg-shape bg-shape-2"></div><div class="bg-shape bg-shape-3"></div>
    <div class="container" style="max-width:1200px">
        <div style="display:flex;gap:60px;align-items:flex-start;flex-wrap:wrap">
            <div style="flex:0 0 320px;width:320px;text-align:center">
                <img src="${aboutContent.photo}" alt="${aboutContent.title}" style="width:320px;height:auto;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.1);display:block">
                <p style="margin:14px 0 0;font-size:1rem;font-weight:600;color:var(--navy)">Olivier Delannoy</p>
                <a href="https://www.linkedin.com/in/olivierdelannoy/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" style="display:inline-block;margin-top:10px;color:var(--navy);transition:opacity .2s" onmouseover="this.style.opacity='.7'" onmouseout="this.style.opacity='1'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect width="24" height="24" rx="4" fill="#0A66C2"/><path d="M7.75 9.5H5.5v8h2.25v-8zm-1.125-1.5a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75zM18.5 17.5h-2.25v-3.9c0-2.1-2.5-1.94-2.5 0v3.9H11.5v-8h2.25v1.18c1.05-1.95 4.75-2.09 4.75 1.87v4.95z" fill="white"/></svg>
                </a>
            </div>
            <div style="flex:1;min-width:300px">
                <h1 style="margin-bottom:30px">${aboutContent.title}</h1>
                ${aboutContent.paragraphs.map(p => `<p style="font-size:1.1rem;line-height:1.8;margin-bottom:24px">${markdownToHtml(p.text)}</p>`).join('')}
            </div>
        </div>
    </div>
</section>
${footerHtml('')}
<script src="script.js"></script>
</body>
</html>`;

// ─── PAGE: contact.html ────────────────────────────────────────────────────
const addr = contactContent.address || {};
const hasAddress = [addr.street, addr.city, addr.country].some(v => v && v.trim());
const addrHtml = hasAddress ? `
            <div class="address-section">
                <h3>Our Address</h3>
                <address>
                    ${addr.companyName && addr.companyName.trim() ? `<strong>${addr.companyName.trim()}</strong><br>` : ''}
                    ${addr.street && addr.street.trim() ? `${addr.street.trim()}<br>` : ''}
                    ${addr.city && addr.city.trim() ? `${addr.city.trim()}<br>` : ''}
                    ${addr.country && addr.country.trim() ? addr.country.trim() : ''}
                </address>
            </div>` : '';

const CONTACT_DESC = 'Get in touch with Vantys. Book a call with Olivier Delannoy to discuss your life science transformation challenges.';
const contactHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${contactContent.title} | VANTYS</title>
${FAVICON_LINKS}
${seoHead({ title: `${contactContent.title} | VANTYS`, description: CONTACT_DESC, canonical: '/contact' })}
    <link rel="stylesheet" href="styles.css">
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
    <style>
        .contact-form-container { max-width: 700px; margin: 60px auto 0; padding: 48px; background: var(--warm-neutral); border-radius: 24px; }
        .address-section { max-width: 700px; margin: 40px auto 0; padding: 48px; background: var(--warm-neutral); border-radius: 24px; }
        .address-section h3 { margin-bottom: 24px; color: var(--navy); font-size: 1.3em; }
        .address-section address { font-style: normal; color: var(--gray); line-height: 1.8; }
        .form-group { margin-bottom: 24px; }
        .form-group label { display: block; margin-bottom: 8px; color: var(--navy); font-weight: 500; font-size: 0.95em; }
        .form-group input, .form-group textarea { width: 100%; padding: 14px 16px; border: 1px solid #ddd; border-radius: 8px; font-size: 1em; font-family: inherit; transition: border-color 0.3s; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--coral); }
        .form-group textarea { resize: vertical; min-height: 150px; }
        .privacy-notice { font-size: 0.85em; color: var(--gray); margin-bottom: 24px; }
        .privacy-notice a { color: var(--coral); text-decoration: none; }
        .privacy-notice a:hover { text-decoration: underline; }
        .submit-button { background: var(--coral); color: var(--white); padding: 16px 48px; border: none; border-radius: 32px; font-weight: 500; font-size: 1em; cursor: pointer; transition: all 0.3s; }
        .submit-button:hover { background: #E8622A; transform: translateY(-2px); }
        .submit-button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .success-message { display: none; padding: 24px; background: #4CAF50; color: white; border-radius: 8px; margin-bottom: 24px; }
        .success-message.show { display: block; }
        .error-message { display: none; padding: 24px; background: #f44336; color: white; border-radius: 8px; margin-bottom: 24px; }
        .error-message.show { display: block; }
        .ohnohoney { opacity: 0; position: absolute; top: 0; left: 0; height: 0; width: 0; z-index: -1; }
    </style>
${CF_ANALYTICS}
</head>
<body>
${BACK_TO_TOP}
${navHtml('')}
<section class="hero">
    <div class="bg-shape bg-shape-1"></div>
    <div class="bg-shape bg-shape-2"></div>
    <div class="bg-shape bg-shape-3"></div>
    <div class="container">
        <h1>${contactContent.title}</h1>
        <p style="max-width:700px">${markdownToHtml(contactContent.description)}</p>
        <div class="contact-form-container">
            <div class="success-message" id="successMessage">Thank you for your message! ${contactContent.responseNote || "We'll get back to you shortly."}</div>
            <div class="error-message" id="errorMessage">Oops! Something went wrong. Please try again or email us directly.</div>
            <form id="contactForm" novalidate>
                <div class="ohnohoney" aria-hidden="true">
                    <label for="website">Website</label>
                    <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
                </div>
                <div class="form-group"><label for="name">Name *</label><input type="text" id="name" name="name" required></div>
                <div class="form-group"><label for="email">Email *</label><input type="email" id="email" name="email" required></div>
                <div class="form-group"><label for="company">Company</label><input type="text" id="company" name="company"></div>
                <div class="form-group"><label for="message">Message *</label><textarea id="message" name="message" required></textarea></div>
                <p class="privacy-notice">By submitting this form, you agree to our <a href="privacy-policy.html">Privacy Policy</a>. We'll use your information only to respond to your inquiry and provide information about our services.</p>
                <button type="submit" class="submit-button" id="submitBtn">Send Message</button>
            </form>
            ${contactContent.vat && contactContent.vat.trim() ? `<p style="margin-top:48px;text-align:left"><strong>Vantys SRL</strong><br>VAT: ${contactContent.vat.trim()}</p>` : ''}
        </div>
        ${addrHtml}
    </div>
</section>
${footerHtml('')}
<script src="script.js"></script>
<script>
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        successMessage.classList.remove('show');
        errorMessage.classList.remove('show');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const payload = {
            website: document.getElementById('website').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value,
            message: document.getElementById('message').value,
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                successMessage.classList.add('show');
                form.reset();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                errorMessage.classList.add('show');
            }
        } catch {
            errorMessage.classList.add('show');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
</script>
</body>
</html>`;

// ─── CASE STUDIES ───────────────────────────────────────────────────────────
const csCmsDir = path.join(__dirname, 'content', 'case-studies');
const csOutDir = path.join(__dirname, 'case-studies');
if (!fs.existsSync(csOutDir)) fs.mkdirSync(csOutDir);

const csFiles = fs.readdirSync(csCmsDir).filter(f => f.endsWith('.json'));
const caseStudies = csFiles
    .map(f => JSON.parse(fs.readFileSync(path.join(csCmsDir, f), 'utf8')))
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

// ─── Pathway block ──────────────────────────────────────────────────────────
const FALLBACK_PATHWAY_SVG = `<svg width="100%" viewBox="0 0 680 310" role="img" xmlns="http://www.w3.org/2000/svg">
    <title>Healthcare transformation pathway</title>
    <desc>Four programme pillars leading to measurable outcomes.</desc>
    <defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#F2AF4C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
    <g transform="translate(18,30)">
        <circle cx="60" cy="50" r="28" fill="none" stroke="#314969" stroke-width="2"/>
        <rect x="46" y="50" width="6" height="16" rx="2" fill="#314969" opacity="0.35"/>
        <rect x="55" y="42" width="6" height="24" rx="2" fill="#314969" opacity="0.6"/>
        <rect x="64" y="36" width="6" height="30" rx="2" fill="#314969"/>
        <line x1="43" y1="66" x2="74" y2="66" stroke="#314969" stroke-width="1.2" opacity="0.4"/>
        <line x1="83" y1="74" x2="97" y2="88" stroke="#314969" stroke-width="3" stroke-linecap="round"/>
        <text x="60" y="110" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#314969">Risk Stratification</text>
        <text x="60" y="124" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#697A92">ML across population</text>
        <text x="60" y="136" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#697A92">health datasets</text>
    </g>
    <line x1="145" y1="80" x2="172" y2="80" stroke="#F2AF4C" stroke-width="2" marker-end="url(#arr)"/>
    <g transform="translate(173,30)">
        <circle cx="44" cy="28" r="11" fill="none" stroke="#314969" stroke-width="2"/>
        <path d="M28 72 Q28 50 44 50 Q60 50 60 72" fill="none" stroke="#314969" stroke-width="2"/>
        <circle cx="76" cy="28" r="11" fill="none" stroke="#F2AF4C" stroke-width="2"/>
        <path d="M60 72 Q60 50 76 50 Q92 50 92 72" fill="none" stroke="#F2AF4C" stroke-width="2"/>
        <circle cx="82" cy="68" r="14" fill="#314969" opacity="0.07" stroke="#314969" stroke-width="1.5"/>
        <path d="M75 68 L80 73 L92 61" fill="none" stroke="#314969" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="60" y="110" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#314969">Patient Engagement</text>
        <text x="60" y="124" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#697A92">Call centre + digital</text>
        <text x="60" y="136" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#697A92">screening pathway</text>
    </g>
    <line x1="295" y1="80" x2="322" y2="80" stroke="#F2AF4C" stroke-width="2" marker-end="url(#arr)"/>
    <g transform="translate(323,20)">
        <rect x="26" y="14" width="56" height="72" rx="6" fill="none" stroke="#314969" stroke-width="2"/>
        <rect x="32" y="20" width="44" height="48" rx="3" fill="#314969" opacity="0.05"/>
        <polyline points="34,46 39,46 43,34 47,58 51,46 55,46 59,40 63,46 68,46 72,46" fill="none" stroke="#314969" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="54" cy="80" r="4" fill="none" stroke="#314969" stroke-width="1.5"/>
        <path d="M88 18 Q92 12 96 18 Q100 25 95 28 Q88 25 88 18Z" fill="#F2AF4C" opacity="0.8"/>
        <text x="57" y="110" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#314969">Remote Monitoring</text>
        <text x="57" y="124" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#697A92">Connected devices +</text>
        <text x="57" y="136" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#697A92">clinical escalation</text>
    </g>
    <line x1="443" y1="80" x2="470" y2="80" stroke="#F2AF4C" stroke-width="2" marker-end="url(#arr)"/>
    <g transform="translate(471,20)">
        <circle cx="57" cy="18" r="13" fill="none" stroke="#314969" stroke-width="2"/>
        <circle cx="57" cy="18" r="7" fill="#314969" opacity="0.1"/>
        <line x1="57" y1="31" x2="57" y2="40" stroke="#314969" stroke-width="2"/>
        <path d="M30 90 Q30 58 57 58 Q84 58 84 90" fill="none" stroke="#314969" stroke-width="2"/>
        <path d="M42 60 Q38 70 43 78 Q50 86 57 78 Q64 86 71 78 Q76 70 72 60" fill="none" stroke="#F2AF4C" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="54" y1="66" x2="60" y2="66" stroke="#F2AF4C" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="57" y1="63" x2="57" y2="69" stroke="#F2AF4C" stroke-width="2.5" stroke-linecap="round"/>
        <text x="57" y="110" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#314969">Pathway Redesign</text>
        <text x="57" y="124" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#697A92">Novel therapies in</text>
        <text x="57" y="136" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#697A92">guideline-concordant care</text>
    </g>
    <rect x="18" y="168" width="644" height="120" rx="12" fill="#314969" opacity="0.05" stroke="#314969" stroke-width="1" stroke-opacity="0.12"/>
    <text x="36" y="186" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#314969" opacity="0.4" letter-spacing="1.5">OUTCOMES WITHIN 18 MONTHS</text>
    <text x="190" y="228" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#314969">+18%</text>
    <text x="190" y="248" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#314969">At-risk patients identified</text>
    <text x="190" y="262" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#697A92">vs standard-of-care</text>
    <line x1="340" y1="178" x2="340" y2="278" stroke="#314969" stroke-width="1" stroke-opacity="0.12"/>
    <text x="400" y="228" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#F2AF4C">&#x2212;7%</text>
    <text x="400" y="248" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#314969">Cardiovascular</text>
    <text x="400" y="262" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#697A92">hospitalisations</text>
    <line x1="530" y1="178" x2="530" y2="278" stroke="#314969" stroke-width="1" stroke-opacity="0.12"/>
    <text x="606" y="228" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#314969">18mo</text>
    <text x="606" y="248" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#314969">Sustainable partnership</text>
    <text x="606" y="262" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#697A92">model established</text>
    <line x1="340" y1="152" x2="340" y2="168" stroke="#F2AF4C" stroke-width="1.5" stroke-dasharray="4 3"/>
</svg>`;

function pathwayBlock(cs) {
    const img = cs.pathway && cs.pathway.image && cs.pathway.image.trim();
    const alt = (cs.pathway && cs.pathway.alt) || 'Programme transformation pathway';
    if (img) return `<img src="${img}" alt="${alt}" class="pathway-custom-img" width="1200" height="400"/>`;
    return FALLBACK_PATHWAY_SVG;
}

const APPROACH_ICON_STYLES = `<style>
@keyframes vty-scan1{0%,15%{transform:scaleY(0)}50%,80%{transform:scaleY(1)}95%,100%{transform:scaleY(0)}}
@keyframes vty-scan2{0%,22%{transform:scaleY(0)}55%,80%{transform:scaleY(1)}95%,100%{transform:scaleY(0)}}
@keyframes vty-scan3{0%,29%{transform:scaleY(0)}60%,80%{transform:scaleY(1)}95%,100%{transform:scaleY(0)}}
@keyframes vty-scan4{0%,36%{transform:scaleY(0)}65%,80%{transform:scaleY(1)}95%,100%{transform:scaleY(0)}}
@keyframes vty-scan5{0%,43%{transform:scaleY(0)}70%,80%{transform:scaleY(1)}95%,100%{transform:scaleY(0)}}
@keyframes vty-wave-c{0%,100%{opacity:1}40%{opacity:0.25}}
@keyframes vty-wave-m{0%,100%{opacity:1}50%{opacity:0.3}}
@keyframes vty-wave-o{0%,100%{opacity:1}60%{opacity:0.4}}
@keyframes vty-hb-c{0%,100%{transform:scaleY(1)}15%{transform:scaleY(1.18)}30%{transform:scaleY(0.94)}45%{transform:scaleY(1)}}
@keyframes vty-hb-m{0%,100%{transform:scaleY(1)}20%{transform:scaleY(1.12)}35%{transform:scaleY(0.96)}50%{transform:scaleY(1)}}
@keyframes vty-hb-o{0%,100%{transform:scaleY(1)}25%{transform:scaleY(1.06)}40%{transform:scaleY(0.98)}55%{transform:scaleY(1)}}
@keyframes vty-build1{0%,5%{opacity:0;transform:scaleY(0)}18%,75%{opacity:1;transform:scaleY(1)}90%,100%{opacity:0;transform:scaleY(0.5)}}
@keyframes vty-build2{0%,15%{opacity:0;transform:scaleY(0)}28%,75%{opacity:1;transform:scaleY(1)}90%,100%{opacity:0;transform:scaleY(0.5)}}
@keyframes vty-build3{0%,25%{opacity:0;transform:scaleY(0)}38%,75%{opacity:1;transform:scaleY(1)}90%,100%{opacity:0;transform:scaleY(0.5)}}
@keyframes vty-build4{0%,35%{opacity:0;transform:scaleY(0)}48%,75%{opacity:1;transform:scaleY(1)}90%,100%{opacity:0;transform:scaleY(0.5)}}
@keyframes vty-build5{0%,45%{opacity:0;transform:scaleY(0)}58%,75%{opacity:1;transform:scaleY(1)}90%,100%{opacity:0;transform:scaleY(0.5)}}
.vty-i1-b1{transform-origin:0 100%;animation:vty-scan1 3s ease-in-out infinite}
.vty-i1-b2{transform-origin:0 100%;animation:vty-scan2 3s ease-in-out infinite}
.vty-i1-b3{transform-origin:0 100%;animation:vty-scan3 3s ease-in-out infinite}
.vty-i1-b4{transform-origin:0 100%;animation:vty-scan4 3s ease-in-out infinite}
.vty-i1-b5{transform-origin:0 100%;animation:vty-scan5 3s ease-in-out infinite}
.vty-i2-b1{animation:vty-wave-o 2s ease-in-out infinite 0.3s}
.vty-i2-b2{animation:vty-wave-m 2s ease-in-out infinite 0.15s}
.vty-i2-b3{animation:vty-wave-c 2s ease-in-out infinite 0s}
.vty-i2-b4{animation:vty-wave-m 2s ease-in-out infinite 0.15s}
.vty-i2-b5{animation:vty-wave-o 2s ease-in-out infinite 0.3s}
.vty-i3-b1{transform-origin:0 50%;animation:vty-hb-o 1.8s ease-in-out infinite 0.12s}
.vty-i3-b2{transform-origin:0 50%;animation:vty-hb-m 1.8s ease-in-out infinite 0.06s}
.vty-i3-b3{transform-origin:0 50%;animation:vty-hb-c 1.8s ease-in-out infinite 0s}
.vty-i3-b4{transform-origin:0 50%;animation:vty-hb-m 1.8s ease-in-out infinite 0.06s}
.vty-i3-b5{transform-origin:0 50%;animation:vty-hb-o 1.8s ease-in-out infinite 0.12s}
.vty-i4-b1{transform-origin:0 100%;animation:vty-build1 3.5s ease-in-out infinite}
.vty-i4-b2{transform-origin:0 100%;animation:vty-build2 3.5s ease-in-out infinite}
.vty-i4-b3{transform-origin:0 100%;animation:vty-build3 3.5s ease-in-out infinite}
.vty-i4-b4{transform-origin:0 100%;animation:vty-build4 3.5s ease-in-out infinite}
.vty-i4-b5{transform-origin:0 100%;animation:vty-build5 3.5s ease-in-out infinite}
</style>`;

const STEP_ICONS = [
    `<svg width="28" height="28" viewBox="0 0 180 180" aria-hidden="true">
      <rect class="vty-i1-b1" x="11"  y="55" width="26" height="70"  rx="6" fill="#F07B4A"/>
      <rect class="vty-i1-b2" x="44"  y="35" width="26" height="110" rx="6" fill="#314969"/>
      <rect class="vty-i1-b3" x="77"  y="42" width="26" height="96"  rx="6" fill="#F07B4A"/>
      <rect class="vty-i1-b4" x="110" y="42" width="26" height="96"  rx="6" fill="#F2AF4C"/>
      <rect class="vty-i1-b5" x="143" y="55" width="26" height="70"  rx="6" fill="#F07B4A"/>
    </svg>`,
    `<svg width="28" height="28" viewBox="0 0 180 180" aria-hidden="true">
      <rect class="vty-i2-b1" x="11"  y="55" width="26" height="70"  rx="6" fill="#F07B4A"/>
      <rect class="vty-i2-b2" x="44"  y="35" width="26" height="110" rx="6" fill="#314969"/>
      <rect class="vty-i2-b3" x="77"  y="42" width="26" height="96"  rx="6" fill="#F07B4A"/>
      <rect class="vty-i2-b4" x="110" y="42" width="26" height="96"  rx="6" fill="#F2AF4C"/>
      <rect class="vty-i2-b5" x="143" y="55" width="26" height="70"  rx="6" fill="#F07B4A"/>
    </svg>`,
    `<svg width="28" height="28" viewBox="0 0 180 180" aria-hidden="true">
      <rect class="vty-i3-b1" x="11"  y="55" width="26" height="70"  rx="6" fill="#F07B4A"/>
      <rect class="vty-i3-b2" x="44"  y="35" width="26" height="110" rx="6" fill="#314969"/>
      <rect class="vty-i3-b3" x="77"  y="42" width="26" height="96"  rx="6" fill="#F07B4A"/>
      <rect class="vty-i3-b4" x="110" y="42" width="26" height="96"  rx="6" fill="#F2AF4C"/>
      <rect class="vty-i3-b5" x="143" y="55" width="26" height="70"  rx="6" fill="#F07B4A"/>
    </svg>`,
    `<svg width="28" height="28" viewBox="0 0 180 180" aria-hidden="true">
      <rect class="vty-i4-b1" x="11"  y="55" width="26" height="70"  rx="6" fill="#F07B4A"/>
      <rect class="vty-i4-b2" x="44"  y="35" width="26" height="110" rx="6" fill="#314969"/>
      <rect class="vty-i4-b3" x="77"  y="42" width="26" height="96"  rx="6" fill="#F07B4A"/>
      <rect class="vty-i4-b4" x="110" y="42" width="26" height="96"  rx="6" fill="#F2AF4C"/>
      <rect class="vty-i4-b5" x="143" y="55" width="26" height="70"  rx="6" fill="#F07B4A"/>
    </svg>`,
];

// ─── Case study DETAIL page ─────────────────────────────────────────────────
function buildDetailPage(cs) {
    const ARROW_LEFT = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const tagHtml      = (cs.tags || []).map(t => `<span class="cs-tag">${t}</span>`).join('');
    const statsHtml    = (cs.outcomes.stats || []).map(s => `<div class="outcome-stat"><span class="number">${s.number}</span><span class="desc">${s.label}</span></div>`).join('');
    const detailsHtml  = (cs.outcomes.details || []).map(d => `<li>${typeof d === 'object' ? d.detail : d}</li>`).join('');
    const approachHtml = (cs.approach.items || []).map((item, i) =>
        `<li><div class="approach-icon">${STEP_ICONS[i] || STEP_ICONS[0]}</div><div><strong>${item.title}</strong><span>${item.description}</span></div></li>`
    ).join('');
    const glanceHtml = (cs.sidebar.atAGlance || []).map(x => `<li>${typeof x === 'object' ? x.item : x}</li>`).join('');
    const capHtml    = (cs.sidebar.capabilities || []).map(x => `<li>${typeof x === 'object' ? x.capability : x}</li>`).join('');
    const hasCustomImg = cs.pathway && cs.pathway.image && cs.pathway.image.trim();
    const pathwayImgStyle = hasCustomImg ? `<style>.pathway-custom-img{display:block;width:100%;max-width:1200px;height:auto;margin:0 auto}</style>` : '';
    const csDesc = cs.teaser || `${cs.shortTitle} — a Vantys life science case study.`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cs.title} | VANTYS</title>
${FAVICON_LINKS}
${seoHead({ title: `${cs.title} | VANTYS`, description: csDesc, canonical: `/case-studies/${cs.slug}`, image: (cs.pathway && cs.pathway.image) || undefined })}
    <link rel="stylesheet" href="../styles.css">
    ${pathwayImgStyle}
    ${APPROACH_ICON_STYLES}
    <style>
        .cs-detail-hero{padding:80px 0 72px;background:linear-gradient(135deg,var(--warm-neutral) 0%,var(--white) 100%)}
        .breadcrumb{font-size:.88em;color:var(--gray);margin-bottom:28px;position:relative;z-index:1}
        .breadcrumb a{color:var(--gray);text-decoration:none;transition:color .2s}.breadcrumb a:hover{color:var(--coral)}
        .breadcrumb span{margin:0 8px;opacity:.5}
        .cs-detail-hero h1{font-size:2.6em;font-weight:300;color:var(--navy);line-height:1.25;max-width:820px;margin-bottom:24px;position:relative;z-index:1}
        .cs-detail-hero h1 strong{font-weight:600;color:var(--coral)}
        .cs-meta-bar{display:flex;gap:12px;flex-wrap:wrap;position:relative;z-index:1}
        .cs-tag{display:inline-block;padding:6px 14px;border-radius:20px;font-size:.82em;font-weight:500;background:rgba(49,73,105,.07);color:var(--navy);border:1px solid rgba(49,73,105,.12)}
        .pathway-section{padding:60px 0;background:linear-gradient(135deg,var(--white) 0%,var(--warm-neutral) 100%)}
        .pathway-section h2{font-size:1.4em;font-weight:400;color:var(--navy);margin-bottom:40px;text-align:center;position:relative;z-index:1}
        .pathway-section h2 strong{font-weight:600;color:var(--coral)}
        .cs-body{padding:80px 0 100px}
        .cs-layout{display:grid;grid-template-columns:1fr 340px;gap:80px;align-items:start}
        .cs-content-block{margin-bottom:60px}
        .section-eyebrow{display:block;font-size:.75em;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--coral);margin-bottom:12px}
        .cs-content-block h2{font-size:1.7em;font-weight:400;color:var(--navy);margin-bottom:20px;line-height:1.3}
        .cs-content-block p{color:var(--gray);line-height:1.8;font-size:1.02em;margin-bottom:16px}
        .approach-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:24px}
        .approach-list li{display:flex;gap:20px;align-items:flex-start}
        .approach-icon{flex-shrink:0;width:44px;height:44px;border-radius:12px;background:var(--warm-neutral);display:flex;align-items:center;justify-content:center}
        .approach-list li>div>strong{display:block;color:var(--navy);font-size:1em;font-weight:600;margin-bottom:4px}
        .approach-list li>div>span{color:var(--gray);font-size:.96em;line-height:1.7}
        .outcome-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-bottom:32px}
        .outcome-stat{background:var(--warm-neutral);border-radius:16px;padding:28px 24px;text-align:center;border-top:3px solid var(--coral)}
        .outcome-stat .number{font-size:2.4em;font-weight:700;color:var(--coral);display:block;line-height:1;margin-bottom:10px}
        .outcome-stat .desc{font-size:.88em;color:var(--navy);line-height:1.5}
        .outcome-detail{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:14px}
        .outcome-detail li{display:flex;gap:12px;align-items:flex-start;color:var(--gray);font-size:.98em;line-height:1.7}
        .outcome-detail li::before{content:'';flex-shrink:0;width:6px;height:6px;border-radius:50%;background:var(--coral);margin-top:9px}
        .cs-sidebar{position:sticky;top:110px;display:flex;flex-direction:column;gap:28px}
        .sidebar-card{background:var(--warm-neutral);border-radius:16px;padding:28px}
        .sidebar-card h4{font-size:.75em;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--gray);margin-bottom:16px}
        .sidebar-card ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px}
        .sidebar-card ul li{font-size:.92em;color:var(--navy);line-height:1.5;padding-left:14px;position:relative}
        .sidebar-card ul li::before{content:'';position:absolute;left:0;top:8px;width:5px;height:5px;border-radius:50%;background:var(--coral)}
        .sidebar-cta{background:var(--navy);border-radius:16px;padding:28px;text-align:center}
        .sidebar-cta p{color:rgba(255,255,255,.75);font-size:.92em;line-height:1.6;margin-bottom:20px}
        .sidebar-cta a{display:block;background:var(--coral);color:var(--white);padding:12px 24px;border-radius:24px;text-decoration:none;font-weight:500;font-size:.92em;transition:all .3s}
        .sidebar-cta a:hover{background:#E8622A;transform:translateY(-2px)}
        .cs-nav-bar{border-top:1px solid var(--warm-neutral);padding:40px 0}
        .cs-nav-link{display:inline-flex;align-items:center;gap:8px;color:var(--gray);text-decoration:none;font-size:.92em;transition:color .2s}
        .cs-nav-link:hover{color:var(--coral)}
        @media(max-width:960px){.cs-layout{grid-template-columns:1fr;gap:48px}.cs-sidebar{position:static}.outcome-stats{grid-template-columns:1fr 1fr}}
        @media(max-width:768px){.cs-detail-hero h1{font-size:1.9em}.outcome-stats{grid-template-columns:1fr}}
    </style>
${CF_ANALYTICS}
</head>
<body>
${BACK_TO_TOP}
${navHtml('../')}
<section class="cs-detail-hero">
    <div class="bg-shape bg-shape-1"></div>
    <div class="bg-shape bg-shape-2"></div>
    <div class="bg-shape bg-shape-3"></div>
    <div class="container">
        <div class="breadcrumb"><a href="../index.html">Home</a><span>/</span><a href="./">Case Studies</a><span>/</span>${cs.shortTitle}</div>
        <h1>${cs.title}</h1>
        <div class="cs-meta-bar">${tagHtml}</div>
    </div>
</section>
<section class="pathway-section">
    <div class="bg-shape bg-shape-1"></div>
    <div class="bg-shape bg-shape-2"></div>
    <div class="container">
        <h2>The <strong>Transformation Pathway</strong></h2>
        ${pathwayBlock(cs)}
    </div>
</section>
<section class="cs-body">
    <div class="container">
        <div class="cs-layout">
            <div class="cs-main">
                <div class="cs-content-block">
                    <span class="section-eyebrow">The Challenge</span>
                    <h2>${cs.challenge.heading}</h2>
                    ${cs.challenge.body.split('\n\n').map(p => `<p>${markdownToHtml(p)}</p>`).join('')}
                </div>
                <div class="cs-content-block">
                    <span class="section-eyebrow">Our Approach</span>
                    <h2>${cs.approach.heading}</h2>
                    <p>${cs.approach.intro}</p>
                    <ul class="approach-list">${approachHtml}</ul>
                </div>
                <div class="cs-content-block">
                    <span class="section-eyebrow">The Outcome</span>
                    <h2>${cs.outcomes.heading}</h2>
                    <div class="outcome-stats">${statsHtml}</div>
                    <ul class="outcome-detail">${detailsHtml}</ul>
                </div>
            </div>
            <aside class="cs-sidebar">
                <div class="sidebar-card"><h4>At a glance</h4><ul>${glanceHtml}</ul></div>
                <div class="sidebar-card"><h4>Capabilities deployed</h4><ul>${capHtml}</ul></div>
                <div class="sidebar-cta"><p>Facing a similar challenge? Let us discuss how we can help.</p><a href="../contact.html">Book a Call</a></div>
            </aside>
        </div>
    </div>
</section>
<div class="cs-nav-bar">
    <div class="container">
        <div style="display:flex;justify-content:space-between;align-items:center">
            <span></span>
            <a href="./" class="cs-nav-link">${ARROW_LEFT} All case studies</a>
        </div>
    </div>
</div>
${footerHtml('../')}
<script src="../script.js"></script>
</body>
</html>`;
}

// ─── Case studies LISTING page ──────────────────────────────────────────────
function buildListingPage(studies) {
    const ARROW = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const featured = studies.find(s => s.featured);
    const rest = studies.filter(s => !s.featured);
    const rawTitle = csIndexContent.title || 'From Strategy to Measurable Impact';
    const highlight = csIndexContent.titleHighlight || '';
    const listingTitle = highlight && rawTitle.includes(highlight)
        ? rawTitle.replace(highlight, `<strong>${highlight}</strong>`)
        : `<strong>${rawTitle}</strong>`;
    const featuredHtml = featured ? `
    <div class="cs-featured">
        <span class="featured-label">Featured Case Study</span>
        <h2>${featured.title}</h2>
        <p>${featured.teaser}</p>
        <div class="cs-meta">${(featured.tags || []).map(t => `<span class="cs-tag cs-tag-light">${t}</span>`).join('')}</div>
        <a href="${featured.slug}.html" class="read-link">Read full story ${ARROW}</a>
    </div>` : '';
    const gridCards = rest.length > 0
        ? rest.map(s => `
        <div class="cs-card">
            <div class="cs-meta">${(s.tags || []).map(t => `<span class="cs-tag cs-tag-dark">${t}</span>`).join('')}</div>
            <h3>${s.shortTitle}</h3>
            <p>${s.teaser}</p>
            <a href="${s.slug}.html" class="read-link">Read full story ${ARROW}</a>
        </div>`).join('')
        : `
        <div class="cs-card coming-soon">
            <div class="cs-meta"><span class="cs-tag cs-tag-dark">Coming soon</span></div>
            <h3>Commercial Model Transformation for a Global Pharma Launch</h3>
            <p>Redesigning the go-to-market model ahead of a major product launch.</p>
            <span class="read-link" style="color:var(--gray)">Coming soon ${ARROW}</span>
        </div>
        <div class="cs-card coming-soon">
            <div class="cs-meta"><span class="cs-tag cs-tag-dark">Coming soon</span></div>
            <h3>AI-Enabled Omnichannel Orchestration for a Specialty Biotech</h3>
            <p>Implementing a practical omnichannel capability with measurable improvements in HCP reach and quality.</p>
            <span class="read-link" style="color:var(--gray)">Coming soon ${ARROW}</span>
        </div>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Case Studies | VANTYS</title>
${FAVICON_LINKS}
${seoHead({ title: 'Case Studies | VANTYS', description: 'Real-world life science transformation case studies by Vantys. Measurable outcomes in commercial operations, healthcare system partnerships, and digital AI implementation.', canonical: '/case-studies/' })}
    <link rel="stylesheet" href="../styles.css">
    <style>
        .cs-section{padding:80px 0 100px;background:var(--white)}
        .featured-label{display:inline-block;font-size:.75em;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--golden);margin-bottom:20px}
        .cs-featured{background:var(--navy);border-radius:24px;padding:56px;margin-bottom:60px;position:relative;overflow:hidden;display:flex;flex-direction:column;gap:24px}
        .cs-featured::before{content:'';position:absolute;width:340px;height:340px;background:var(--coral);border-radius:60px;top:-120px;right:-80px;opacity:.08;transform:rotate(22deg)}
        .cs-featured h2{font-size:1.9em;font-weight:400;color:var(--white);line-height:1.3;max-width:700px;position:relative;z-index:1}
        .cs-featured p{color:rgba(255,255,255,.75);font-size:1.05em;line-height:1.7;max-width:680px;position:relative;z-index:1}
        .cs-meta{display:flex;gap:12px;flex-wrap:wrap;position:relative;z-index:1}
        .cs-tag{display:inline-block;padding:6px 14px;border-radius:20px;font-size:.82em;font-weight:500}
        .cs-tag-light{background:rgba(255,255,255,.1);color:rgba(255,255,255,.8);border:1px solid rgba(255,255,255,.15)}
        .cs-tag-dark{background:rgba(49,73,105,.08);color:var(--navy);border:1px solid rgba(49,73,105,.12)}
        .read-link{display:inline-flex;align-items:center;gap:8px;text-decoration:none;font-weight:500;font-size:.95em;transition:gap .3s;position:relative;z-index:1}
        .cs-featured .read-link{color:var(--golden)}
        .cs-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:32px}
        .cs-card{background:var(--warm-neutral);border-radius:20px;padding:40px 36px;border-left:4px solid transparent;transition:all .3s;display:flex;flex-direction:column;gap:16px}
        .cs-card:hover{border-left-color:var(--coral);background:var(--white);box-shadow:0 8px 32px rgba(49,73,105,.08)}
        .cs-card h3{font-size:1.2em;font-weight:500;color:var(--navy);line-height:1.4}
        .cs-card p{color:var(--gray);font-size:.95em;line-height:1.7;flex:1}
        .cs-card .read-link{color:var(--coral)}
        .coming-soon{opacity:.55;pointer-events:none}
        .cs-hero p{position:relative;z-index:1}
        .cs-hero h1{position:relative;z-index:1}
        @media(max-width:768px){.cs-featured{padding:36px 28px}.cs-featured h2{font-size:1.5em}.cs-grid{grid-template-columns:1fr}}
    </style>
${CF_ANALYTICS}
</head>
<body>
${BACK_TO_TOP}
${navHtml('../')}
<section class="cs-hero">
    <div class="bg-shape bg-shape-1"></div><div class="bg-shape bg-shape-2"></div>
    <div class="container">
        <h1>${listingTitle}</h1>
        <p>${csIndexContent.subtitle}</p>
    </div>
</section>
<section class="cs-section">
    <div class="container">
        ${featuredHtml}
        <div class="cs-grid">${gridCards}</div>
    </div>
</section>
<section class="cta-section">
    <div class="bg-shape bg-shape-1"></div><div class="bg-shape bg-shape-2"></div><div class="bg-shape bg-shape-3"></div>
    <div class="container">
        <h2>${csIndexContent.cta.title}</h2>
        <p>${csIndexContent.cta.description}</p>
        <a href="${csIndexContent.cta.buttonLink}" class="cta-button">${csIndexContent.cta.buttonText}</a>
    </div>
</section>
${footerHtml('../')}
<script src="../script.js"></script>
</body>
</html>`;
}

// ─── FREE PAGES ────────────────────────────────────────────────────────────────────
const FREE_PAGE_SHARED_STYLES = `
    <style>
        .fp-content{padding:60px 0;background:var(--white)}
        .fp-blocks{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:48px}
        .fp-block{border-left:3px solid var(--coral);padding-left:28px}
        .fp-block-heading{font-size:1.4em;font-weight:500;color:var(--navy);margin-bottom:16px;line-height:1.3}
        .fp-block-body{color:var(--gray);line-height:1.8}
        .fp-block-body p{margin-bottom:12px}
        .fp-block-body h2{font-size:1.3em;font-weight:500;color:var(--navy);margin:24px 0 12px}
        .fp-block-body h3{font-size:1.1em;font-weight:600;color:var(--navy);margin:20px 0 8px}
        .fp-block-body strong{color:var(--navy)}
        .fp-block-body ul,.fp-block-body ol{padding-left:20px;margin-bottom:12px}
        .fp-block-body li{margin-bottom:6px}
        .fp-block-body a{color:var(--coral);text-decoration:none}
        .fp-block-body a:hover{text-decoration:underline}
        .tc-content{padding:60px 0;background:var(--white)}
        .tc-rows{display:flex;flex-direction:column;gap:80px}
        .tc-row{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
        .tc-heading{font-size:1.6em;font-weight:500;color:var(--navy);margin-bottom:20px;line-height:1.3}
        .tc-body{color:var(--gray);line-height:1.8}
        .tc-body p{margin-bottom:12px}
        .tc-body strong{color:var(--navy)}
        .tc-body a{color:var(--coral);text-decoration:none}
        .fc-content{padding:60px 0;background:var(--white)}
        .fc-grid{display:grid;gap:32px}
        .fc-card{background:var(--warm-neutral);border-radius:20px;padding:36px;border-left:4px solid transparent;transition:all .3s}
        .fc-card:hover{border-left-color:var(--coral);background:var(--white);box-shadow:0 8px 32px rgba(49,73,105,.08)}
        .fc-card-title{font-size:1.2em;font-weight:600;color:var(--navy);margin-bottom:14px;line-height:1.3}
        .fc-card-body{color:var(--gray);line-height:1.7;font-size:.97em}
        .fc-card-body p{margin-bottom:8px}
        .fc-card-body strong{color:var(--navy)}
        @media(max-width:768px){.tc-row{grid-template-columns:1fr}.tc-img{order:-1}.fc-grid{grid-template-columns:1fr!important}}
    </style>`;

function renderBlocks(page) {
    if (!page.blocks || page.blocks.length === 0) return '';
    const layout = page.layout || 'text-simple';
    if (layout === 'two-columns') {
        const rowsHtml = page.blocks.map(block => {
            const imgSide = block.imagePosition === 'left' ? 'left' : 'right';
            const imgHtml = block.image && block.image.trim()
                ? `<img src="${block.image}" alt="${block.imageAlt || ''}" style="width:100%;height:auto;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.1);display:block">`
                : `<div style="width:100%;aspect-ratio:4/3;border-radius:12px;background:var(--warm-neutral);display:flex;align-items:center;justify-content:center;color:var(--gray);font-size:.9em;border:2px dashed rgba(49,73,105,.15)">Image placeholder</div>`;
            const textCol = `<div class="tc-text">${block.heading ? `<h2 class="tc-heading">${block.heading}</h2>` : ''}<div class="tc-body"><p>${markdownToHtml(block.body || '')}</p></div></div>`;
            const imgCol = `<div class="tc-img">${imgHtml}</div>`;
            const cols = imgSide === 'left' ? `${imgCol}${textCol}` : `${textCol}${imgCol}`;
            return `<div class="tc-row">${cols}</div>`;
        }).join('');
        return `<section class="tc-content"><div class="container"><div class="tc-rows">${rowsHtml}</div></div></section>`;
    }
    const blocksHtml = page.blocks.map(block => `
        <div class="fp-block">
            ${block.heading ? `<h2 class="fp-block-heading">${block.heading}</h2>` : ''}
            <div class="fp-block-body"><p>${markdownToHtml(block.body || '')}</p></div>
        </div>`).join('');
    return `<section class="fp-content"><div class="container"><div class="fp-blocks">${blocksHtml}</div></div></section>`;
}

function renderCards(page) {
    if (!page.cards || page.cards.length === 0) return '';
    const cols = parseInt(page.columns || '3', 10);
    const minWidth = cols === 2 ? '440px' : cols === 4 ? '220px' : '300px';
    const cardsHtml = page.cards.map(card => `
        <div class="fc-card">
            <h3 class="fc-card-title">${card.title}</h3>
            <div class="fc-card-body"><p>${markdownToHtml(card.body || '')}</p></div>
        </div>`).join('');
    return `<section class="fc-content"><div class="container"><div class="fc-grid" style="grid-template-columns:repeat(auto-fit,minmax(${minWidth},1fr))">${cardsHtml}</div></div></section>`;
}

function renderSections(page) {
    if (!page.sections || page.sections.length === 0) return '';
    return page.sections.map(section => {
        const bg = section.background === 'neutral' ? 'var(--warm-neutral)' : 'var(--white)';
        return `<section style="padding:60px 0;background:${bg}">
            <div class="container" style="max-width:800px">
                ${section.heading ? `<h2 style="font-size:1.7em;font-weight:400;color:var(--navy);margin-bottom:20px;line-height:1.3">${section.heading}</h2>` : ''}
                <div style="color:var(--gray);line-height:1.8;font-size:1.05em"><p>${markdownToHtml(section.body || '')}</p></div>
            </div>
        </section>`;
    }).join('');
}

function buildFreePage(page) {
    const ctaHtml = page.ctaText && page.ctaLink
        ? `<a href="${page.ctaLink}" class="cta-button" style="position:relative;z-index:1">${page.ctaText}</a>`
        : '';
    const contentHtml = renderBlocks(page) + renderCards(page) + renderSections(page);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title} | VANTYS</title>
${FAVICON_LINKS}
${seoHead({ title: `${page.title} | VANTYS`, description: page.intro || '', canonical: `/${page.slug}` })}
    <link rel="stylesheet" href="styles.css">
    ${FREE_PAGE_SHARED_STYLES}
${CF_ANALYTICS}
</head>
<body>
${BACK_TO_TOP}
${navHtml('')}
<section class="hero">
    <div class="bg-shape bg-shape-1"></div>
    <div class="bg-shape bg-shape-2"></div>
    <div class="bg-shape bg-shape-3"></div>
    <div class="container">
        <h1>${page.title}</h1>
        ${page.intro ? `<p style="font-size:1.15em;color:var(--gray);max-width:700px;position:relative;z-index:1">${page.intro}</p>` : ''}
        ${ctaHtml}
    </div>
</section>
${contentHtml}
${footerHtml('')}
<script src="script.js"></script>
</body>
</html>`;
}

// ─── BLOG ────────────────────────────────────────────────────────────────────
const blogCmsDir = path.join(__dirname, 'content', 'articles');
const blogOutDir = path.join(__dirname, 'blog');
if (!fs.existsSync(blogOutDir)) fs.mkdirSync(blogOutDir);

function buildArticlePage(article, allArticles) {
    const tagHtml = (article.tags || []).map(t => `<span class="blog-tag">${t}</span>`).join('');
    const dateStr = formatDate(article.date);
    const heroImgHtml = article.heroImage && article.heroImage.trim()
        ? `<img src="${article.heroImage}" alt="${article.heroImageAlt || article.title}" style="width:100%;height:auto;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.1);margin-bottom:48px;display:block">`
        : '';
    const recentArticles = allArticles.filter(a => a.slug !== article.slug && a.published !== false).slice(0, 4);
    const recentHtml = recentArticles.length > 0
        ? recentArticles.map(a => `
            <a href="${a.slug}.html" class="sidebar-recent-item">
                <span class="sidebar-recent-title">${a.title}</span>
                <span class="sidebar-recent-date">${formatDate(a.date)}</span>
            </a>`).join('')
        : '<p style="color:var(--gray);font-size:.9em">No other articles yet.</p>';

    const bodyHtml = (article.body || '').split('\n\n').map(p => {
        const trimmed = p.trim();
        if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) return markdownToHtml(trimmed);
        if (trimmed === '---') return `<hr style="border:none;border-top:1px solid var(--warm-neutral);margin:40px 0">`;
        return `<p>${markdownToHtml(trimmed)}</p>`;
    }).join('');

    const articleDesc = article.excerpt
        ? article.excerpt.replace(/\n/g, ' ').substring(0, 155)
        : article.title;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} | VANTYS</title>
${FAVICON_LINKS}
${seoHead({ title: `${article.title} | VANTYS`, description: articleDesc, canonical: `/blog/${article.slug}`, image: article.heroImage || undefined })}
    <link rel="stylesheet" href="../styles.css">
    <style>
        .blog-hero{padding:80px 0 60px;background:linear-gradient(135deg,var(--warm-neutral) 0%,var(--white) 100%)}
        .blog-hero .breadcrumb{font-size:.88em;color:var(--gray);margin-bottom:28px;position:relative;z-index:1}
        .blog-hero .breadcrumb a{color:var(--gray);text-decoration:none;transition:color .2s}
        .blog-hero .breadcrumb a:hover{color:var(--coral)}
        .blog-hero .breadcrumb span{margin:0 8px;opacity:.5}
        .blog-hero h1{font-size:2.4em;font-weight:300;color:var(--navy);line-height:1.25;max-width:820px;margin-bottom:20px;position:relative;z-index:1}
        .blog-meta{display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-bottom:16px;position:relative;z-index:1}
        .blog-date{font-size:.88em;color:var(--gray)}
        .blog-reading-time{font-size:.88em;color:var(--gray)}
        .blog-reading-time::before{content:'·';margin-right:20px}
        .blog-tags{display:flex;gap:8px;flex-wrap:wrap;position:relative;z-index:1}
        .blog-tag{display:inline-block;padding:5px 12px;border-radius:20px;font-size:.78em;font-weight:500;background:rgba(49,73,105,.07);color:var(--navy);border:1px solid rgba(49,73,105,.12)}
        .blog-body{padding:60px 0 100px;background:var(--white)}
        .blog-layout{display:grid;grid-template-columns:1fr 300px;gap:80px;align-items:start}
        .blog-content h2{font-size:1.5em;font-weight:500;color:var(--navy);margin:36px 0 16px;line-height:1.3}
        .blog-content h3{font-size:1.2em;font-weight:600;color:var(--navy);margin:28px 0 12px}
        .blog-content p{color:var(--gray);line-height:1.85;font-size:1.05em;margin-bottom:20px}
        .blog-content strong{color:var(--navy)}
        .blog-content ul,.blog-content ol{padding-left:24px;margin-bottom:20px;color:var(--gray);line-height:1.8}
        .blog-content li{margin-bottom:8px}
        .blog-content a{color:var(--coral);text-decoration:none}
        .blog-content a:hover{text-decoration:underline}
        .blog-sidebar{position:sticky;top:110px;display:flex;flex-direction:column;gap:28px}
        .sidebar-card{background:var(--warm-neutral);border-radius:16px;padding:24px}
        .sidebar-card h4{font-size:.75em;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--gray);margin-bottom:16px}
        .sidebar-recent-item{display:block;text-decoration:none;padding:12px 0;border-bottom:1px solid rgba(49,73,105,.08)}
        .sidebar-recent-item:last-child{border-bottom:none}
        .sidebar-recent-title{display:block;font-size:.92em;color:var(--navy);line-height:1.4;margin-bottom:4px;transition:color .2s}
        .sidebar-recent-item:hover .sidebar-recent-title{color:var(--coral)}
        .sidebar-recent-date{display:block;font-size:.78em;color:var(--gray)}
        .blog-nav-bar{border-top:1px solid var(--warm-neutral);padding:40px 0}
        .blog-nav-link{display:inline-flex;align-items:center;gap:8px;color:var(--gray);text-decoration:none;font-size:.92em;transition:color .2s}
        .blog-nav-link:hover{color:var(--coral)}
        @media(max-width:960px){.blog-layout{grid-template-columns:1fr;gap:48px}.blog-sidebar{position:static}}
        @media(max-width:768px){.blog-hero h1{font-size:1.8em}}
    </style>
${CF_ANALYTICS}
</head>
<body>
${BACK_TO_TOP}
${navHtml('../')}
<section class="blog-hero">
    <div class="bg-shape bg-shape-1"></div>
    <div class="bg-shape bg-shape-2"></div>
    <div class="bg-shape bg-shape-3"></div>
    <div class="container">
        <div class="breadcrumb"><a href="../index.html">Home</a><span>/</span><a href="./">Blog</a><span>/</span>${article.title}</div>
        <h1>${article.title}</h1>
        <div class="blog-meta">
            ${dateStr ? `<span class="blog-date">${dateStr}</span>` : ''}
            ${article.readingTime ? `<span class="blog-reading-time">${article.readingTime} min read</span>` : ''}
        </div>
        <div class="blog-tags">${tagHtml}</div>
    </div>
</section>
<section class="blog-body">
    <div class="bg-shape bg-shape-1"></div>
    <div class="bg-shape bg-shape-2"></div>
    <div class="bg-shape bg-shape-3"></div>
    <div class="container">
        <div class="blog-layout">
            <div class="blog-content">
                ${heroImgHtml}
                ${bodyHtml}
            </div>
            <aside class="blog-sidebar">
                <div class="sidebar-card">
                    <h4>Recent articles</h4>
                    ${recentHtml}
                </div>
            </aside>
        </div>
    </div>
</section>
<div class="blog-nav-bar">
    <div class="container">
        <a href="./" class="blog-nav-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            All articles
        </a>
    </div>
</div>
${footerHtml('../')}
<script src="../script.js"></script>
</body>
</html>`;
}

function buildBlogListingPage(articles) {
    const ARROW = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const cardsHtml = articles.map(a => {
        const tagHtml = (a.tags || []).slice(0, 2).map(t => `<span class="blog-tag-dark">${t}</span>`).join('');
        const thumbHtml = a.heroImage && a.heroImage.trim()
            ? `<div class="blog-card-thumb"><img src="${a.heroImage}" alt="${a.heroImageAlt || a.title}" loading="lazy"></div>`
            : `<div class="blog-card-thumb blog-card-thumb--placeholder"><svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" rx="6" stroke="#697A92" stroke-width="1.5" opacity="0.3"/><path d="M4 28l8-8 6 6 5-5 9 9" stroke="#697A92" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/><circle cx="15" cy="15" r="3" stroke="#697A92" stroke-width="1.5" opacity="0.4"/></svg></div>`;
        return `
        <div class="blog-card">
            <div class="blog-card-inner">
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        ${formatDate(a.date) ? `<span class="blog-card-date">${formatDate(a.date)}</span>` : ''}
                        ${a.readingTime ? `<span class="blog-card-rt">${a.readingTime} min read</span>` : ''}
                    </div>
                    <h2 class="blog-card-title"><a href="${a.slug}.html">${a.title}</a></h2>
                    <p class="blog-card-excerpt">${a.excerpt || ''}</p>
                    <div class="blog-card-footer">
                        <div class="blog-card-tags">${tagHtml}</div>
                        <a href="${a.slug}.html" class="read-link">Read article ${ARROW}</a>
                    </div>
                </div>
                ${thumbHtml}
            </div>
        </div>`;
    }).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog | VANTYS</title>
${FAVICON_LINKS}
${seoHead({ title: 'Blog | VANTYS', description: 'Insights on life science commercial strategy, digital transformation, AI implementation, and omnichannel excellence. By Olivier Delannoy, Vantys.', canonical: '/blog/' })}
    <link rel="stylesheet" href="../styles.css">
    <style>
        .blog-listing{padding:80px 0 100px;background:var(--white)}
        .blog-grid{display:flex;flex-direction:column;gap:40px;max-width:800px}
        .blog-card{background:var(--warm-neutral);border-radius:20px;padding:36px 40px;border-left:4px solid transparent;transition:all .3s}
        .blog-card:hover{border-left-color:var(--coral);background:var(--white);box-shadow:0 8px 32px rgba(49,73,105,.08)}
        .blog-card-inner{display:flex;gap:28px;align-items:flex-start}
        .blog-card-content{flex:1;min-width:0}
        .blog-card-thumb{flex-shrink:0;width:120px;height:90px;border-radius:10px;overflow:hidden;background:rgba(49,73,105,.06)}
        .blog-card-thumb img{width:100%;height:100%;object-fit:cover;display:block}
        .blog-card-thumb--placeholder{display:flex;align-items:center;justify-content:center}
        .blog-card-meta{display:flex;gap:16px;align-items:center;margin-bottom:10px}
        .blog-card-date{font-size:.82em;color:var(--gray)}
        .blog-card-rt{font-size:.82em;color:var(--gray)}
        .blog-card-rt::before{content:'·';margin-right:16px}
        .blog-card-title{font-size:1.25em;font-weight:400;color:var(--navy);line-height:1.3;margin-bottom:10px}
        .blog-card-title a{text-decoration:none;color:inherit;transition:color .2s}
        .blog-card-title a:hover{color:var(--coral)}
        .blog-card-excerpt{color:var(--gray);line-height:1.7;font-size:.95em;margin-bottom:16px}
        .blog-card-footer{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
        .blog-card-tags{display:flex;gap:8px;flex-wrap:wrap}
        .blog-tag-dark{display:inline-block;padding:4px 10px;border-radius:16px;font-size:.76em;font-weight:500;background:rgba(49,73,105,.08);color:var(--navy);border:1px solid rgba(49,73,105,.12)}
        .read-link{display:inline-flex;align-items:center;gap:8px;text-decoration:none;font-weight:500;font-size:.92em;color:var(--coral);transition:gap .3s}
        .read-link:hover{gap:12px}
        .blog-hero p{position:relative;z-index:1}
        @media(max-width:768px){.blog-card{padding:24px}.blog-card-inner{flex-direction:column-reverse;gap:16px}.blog-card-thumb{width:100%;height:160px}}
    </style>
${CF_ANALYTICS}
</head>
<body>
${BACK_TO_TOP}
${navHtml('../')}
<section class="hero blog-hero">
    <div class="bg-shape bg-shape-1"></div><div class="bg-shape bg-shape-2"></div>
    <div class="container">
        <h1>${blogSettings.title.replace('Perspectives', '<strong>Perspectives</strong>')}</h1>
        <p>${blogSettings.subtitle}</p>
    </div>
</section>
<section class="blog-listing">
    <div class="container">
        <div class="blog-grid">${cardsHtml}</div>
    </div>
</section>
${footerHtml('../')}
<script src="../script.js"></script>
</body>
</html>`;
}

// ─── Write all files ─────────────────────────────────────────────────────────
fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtml, 'utf8');
fs.writeFileSync(path.join(__dirname, 'about-me.html'), aboutHtml, 'utf8');
fs.writeFileSync(path.join(__dirname, 'contact.html'), contactHtml, 'utf8');

caseStudies.forEach(cs => {
    fs.writeFileSync(path.join(csOutDir, `${cs.slug}.html`), buildDetailPage(cs), 'utf8');
    console.log(`  ✅ case-studies/${cs.slug}.html`);
});
fs.writeFileSync(path.join(csOutDir, 'index.html'), buildListingPage(caseStudies), 'utf8');

const freePagesDir = path.join(__dirname, 'content', 'pages');
if (fs.existsSync(freePagesDir)) {
    const freePageFiles = fs.readdirSync(freePagesDir).filter(f => f.endsWith('.json'));
    let count = 0;
    freePageFiles.forEach(f => {
        const page = JSON.parse(fs.readFileSync(path.join(freePagesDir, f), 'utf8'));
        if (page.published === false) { console.log(`  ⏭️  ${page.slug}.html (unpublished)`); return; }
        fs.writeFileSync(path.join(__dirname, `${page.slug}.html`), buildFreePage(page), 'utf8');
        console.log(`  ✅ ${page.slug}.html`);
        count++;
    });
    console.log(`✅ ${count} free page(s) generated`);
}

// ─── Collect all pages for sitemap ──────────────────────────────────────────
const sitemapUrls = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'monthly' },
    { loc: `${BASE_URL}/about-me.html`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${BASE_URL}/contact.html`, priority: '0.7', changefreq: 'yearly' },
    { loc: `${BASE_URL}/case-studies/`, priority: '0.9', changefreq: 'monthly' },
    { loc: `${BASE_URL}/blog/`, priority: '0.8', changefreq: 'weekly' },
];

caseStudies.forEach(cs => {
    sitemapUrls.push({ loc: `${BASE_URL}/case-studies/${cs.slug}`, priority: '0.8', changefreq: 'monthly' });
});

if (fs.existsSync(blogCmsDir)) {
    const articleFiles = fs.readdirSync(blogCmsDir).filter(f => f.endsWith('.json'));
    const articles = articleFiles
        .map(f => JSON.parse(fs.readFileSync(path.join(blogCmsDir, f), 'utf8')))
        .filter(a => a.published !== false)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    articles.forEach(article => {
        fs.writeFileSync(path.join(blogOutDir, `${article.slug}.html`), buildArticlePage(article, articles), 'utf8');
        console.log(`  ✅ blog/${article.slug}.html`);
        sitemapUrls.push({ loc: `${BASE_URL}/blog/${article.slug}`, priority: '0.7', changefreq: 'yearly' });
    });
    fs.writeFileSync(path.join(blogOutDir, 'index.html'), buildBlogListingPage(articles), 'utf8');
    console.log(`✅ blog/index.html (${articles.length} article(s))`);
}

// ─── Generate sitemap.xml ────────────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapXml, 'utf8');
console.log('✅ sitemap.xml');

console.log('✅ index.html');
console.log('✅ about-me.html');
console.log('✅ contact.html');
console.log('✅ case-studies/index.html');
console.log(`✅ ${caseStudies.length} case study detail page(s) generated`);
