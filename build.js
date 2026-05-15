const fs = require('fs');
const path = require('path');

// ─── Markdown → HTML ───────────────────────────────────────────────────────
function markdownToHtml(text) {
    if (!text) return '';
    return text
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/__([^_]+)__/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/_([^_]+)_/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
}

// ─── Read content JSON ──────────────────────────────────────────────────────
const homepageContent   = JSON.parse(fs.readFileSync(path.join(__dirname, 'content', 'homepage.json'), 'utf8'));
const aboutContent      = JSON.parse(fs.readFileSync(path.join(__dirname, 'content', 'about-me.json'), 'utf8'));
const csIndexContent    = JSON.parse(fs.readFileSync(path.join(__dirname, 'content', 'case-studies-index.json'), 'utf8'));

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

function navHtml(activeHref, prefix = '') {
    const links = [
        { href: `${prefix}index.html#services`, label: 'Services' },
        { href: `${prefix}index.html#approach`,  label: 'Approach' },
        { href: `${prefix}case-studies/`,        label: 'Case Studies' },
        { href: `${prefix}about-me.html`,        label: 'About Me' },
        { href: `${prefix}contact.html`,         label: 'Contact' },
    ];
    const items = links.map(l =>
        `<li><a href="${l.href}"${l.href === activeHref ? ' class="active"' : ''}>${l.label}</a></li>`
    ).join('\n                ');
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
    return `<footer>
    <div class="container">
        <p>&copy; 2026 Vantys SRL. Life Science Business Consulting.</p>
        <p>All rights reserved.</p>
        <p><a href="${homepageContent.footer.linkedinUrl}">LinkedIn</a> | <a href="${prefix}privacy-policy.html">Privacy Policy</a></p>
    </div>
</footer>`;
}

// ─── PAGE: index.html ───────────────────────────────────────────────────────
let heroTitle = homepageContent.hero.title && homepageContent.hero.title.trim()
    ? `${homepageContent.hero.title} <strong>${homepageContent.hero.titleHighlight}</strong>`
    : `<strong>${homepageContent.hero.titleHighlight}</strong>`;

const serviceIcons = [
    `<svg width="100" height="100" viewBox="0 0 100 100" fill="none"><rect x="30" y="30" width="40" height="40" stroke="#697A92" stroke-width="1.5" fill="none" opacity="0.3"/><rect x="25" y="25" width="50" height="50" stroke="#314969" stroke-width="1.5" fill="none" opacity="0.6"/><rect x="20" y="20" width="60" height="60" stroke="#F07B4A" stroke-width="2.5" fill="none"/></svg>`,
    `<svg width="100" height="100" viewBox="0 0 100 100" fill="none"><defs><clipPath id="lc"><circle cx="40" cy="50" r="25"/></clipPath><clipPath id="rc"><circle cx="60" cy="50" r="25"/></clipPath></defs><circle cx="40" cy="50" r="25" fill="#F07B4A" clip-path="url(#rc)"/><circle cx="40" cy="50" r="25" fill="none" stroke="#314969" stroke-width="2"/><circle cx="60" cy="50" r="25" fill="none" stroke="#314969" stroke-width="2"/></svg>`,
    `<svg width="100" height="100" viewBox="0 0 100 100" fill="none"><line x1="20" y1="65" x2="60" y2="65" stroke="#697A92" stroke-width="1.5" opacity="0.4"/><line x1="20" y1="50" x2="70" y2="50" stroke="#314969" stroke-width="1.5" opacity="0.7"/><line x1="20" y1="35" x2="80" y2="35" stroke="#F07B4A" stroke-width="2.5"/><circle cx="80" cy="35" r="3" fill="#F07B4A"/></svg>`,
];
const approachIcons = [
    `<svg width="100" height="100" viewBox="0 0 100 100" fill="none"><rect x="30" y="30" width="20" height="20" stroke="#697A92" stroke-width="1.5" fill="none" opacity="0.4"/><rect x="30" y="30" width="35" height="35" stroke="#314969" stroke-width="1.5" fill="none" opacity="0.7"/><rect x="30" y="30" width="50" height="50" stroke="#F07B4A" stroke-width="2.5" fill="none"/></svg>`,
    `<svg width="100" height="100" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="15" stroke="#697A92" stroke-width="1.5" fill="none" opacity="0.4"/><circle cx="50" cy="50" r="25" stroke="#314969" stroke-width="1.5" fill="none" opacity="0.7"/><circle cx="50" cy="50" r="35" stroke="#F07B4A" stroke-width="2.5" fill="none"/></svg>`,
    `<svg width="100" height="100" viewBox="0 0 100 100" fill="none"><rect x="25" y="60" width="15" height="20" stroke="#697A92" stroke-width="1.5" fill="none" opacity="0.4"/><rect x="45" y="50" width="15" height="30" stroke="#314969" stroke-width="1.5" fill="none" opacity="0.7"/><rect x="65" y="30" width="15" height="50" stroke="#F07B4A" stroke-width="2.5" fill="none"/><line x1="20" y1="80" x2="85" y2="80" stroke="#314969" stroke-width="1.5" opacity="0.3"/></svg>`,
];

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VANTYS | Pharmaceutical Operations Consulting</title>
${FAVICON_LINKS}
    <link rel="stylesheet" href="styles.css">
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</head>
<body>
${BACK_TO_TOP}
${navHtml('', '')}
<section class="hero">
    <div class="bg-shape bg-shape-1"></div><div class="bg-shape bg-shape-2"></div><div class="bg-shape bg-shape-3"></div>
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
const aboutHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${aboutContent.title} | VANTYS</title>
${FAVICON_LINKS}
    <link rel="stylesheet" href="styles.css">
</head>
<body>
${BACK_TO_TOP}
${navHtml('about-me.html', '')}
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

// ─── Animated Vantys-logo approach icons (inline SVG, CSS-animated) ─────────
// Icon 1 — Sequential scan (Risk Stratification / Process Reengineering / Commercial Excellence)
// Icon 2 — Wave pulse  (Patient Engagement / Open-Source Stack / MMM)
// Icon 3 — Heartbeat   (Remote Monitoring / User Experience / Resource Optimisation)
// Icon 4 — Build path  (Pathway Redesign / Compliance / Capability Building)
// If a case study has only 3 items, icons 0-2 are used (icon 3 is omitted automatically).

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

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cs.title} | VANTYS</title>
${FAVICON_LINKS}
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
</head>
<body>
${BACK_TO_TOP}
${navHtml('case-studies/', '../')}
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
</head>
<body>
${BACK_TO_TOP}
${navHtml('case-studies/', '../')}
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

// ─── Write all files ─────────────────────────────────────────────────────────
fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtml, 'utf8');
fs.writeFileSync(path.join(__dirname, 'about-me.html'), aboutHtml, 'utf8');

caseStudies.forEach(cs => {
    fs.writeFileSync(path.join(csOutDir, `${cs.slug}.html`), buildDetailPage(cs), 'utf8');
    console.log(`  ✅ case-studies/${cs.slug}.html`);
});

fs.writeFileSync(path.join(csOutDir, 'index.html'), buildListingPage(caseStudies), 'utf8');
console.log('✅ index.html');
console.log('✅ about-me.html');
console.log('✅ case-studies/index.html');
console.log(`✅ ${caseStudies.length} case study detail page(s) generated`);
