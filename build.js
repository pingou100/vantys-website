const fs = require('fs');
const path = require('path');

// Simple markdown to HTML converter
function markdownToHtml(text) {
    if (!text) return '';
    
    // Convert markdown to HTML
    let html = text
        // Bold: **text** or __text__
        .replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/__([^_]+)__/g, '<strong>$1</strong>')
        // Italic: *text* or _text_
        .replace(/\*([^\*]+)\*/g, '<em>$1</em>')
        .replace(/_([^_]+)_/g, '<em>$1</em>')
        // Links: [text](url)
        .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>')
        // Line breaks
        .replace(/\n/g, ' ');
    
    return html;
}

// Read the content JSON
const contentPath = path.join(__dirname, 'content', 'homepage.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

// Build hero title - handle empty title gracefully
let heroTitle = '';
if (content.hero.title && content.hero.title.trim()) {
    // Both title and highlight
    heroTitle = `${content.hero.title} <strong>${content.hero.titleHighlight}</strong>`;
} else {
    // Only highlight (title is empty)
    heroTitle = `<strong>${content.hero.titleHighlight}</strong>`;
}

// Generate the complete HTML from scratch using the template
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VANTYS | Pharmaceutical Operations Consulting</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</head>
<body>
    <!-- Back to Top Button -->
    <div class="back-to-top" id="backToTop">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>

    <!-- Header -->
    <header>
        <nav class="container">
            <div class="logo-container">
                <svg class="logo-icon" width="50" height="40" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="10" width="5" height="14" rx="2.5" fill="#F07B4A"/>
                    <rect x="9" y="4" width="5" height="24" rx="2.5" fill="#314969"/>
                    <rect x="16" y="6" width="5" height="20" rx="2.5" fill="#F07B4A"/>
                    <rect x="23" y="6" width="5" height="20" rx="2.5" fill="#F2AF4C"/>
                    <rect x="30" y="10" width="5" height="14" rx="2.5" fill="#F07B4A"/>
                </svg>
                <span class="logo">vantys</span>
            </div>
            
            <!-- Mobile Menu Toggle -->
            <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            
            <ul class="nav-links">
                <li><a href="#services">Services</a></li>
                <li><a href="#approach">Approach</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="bg-shape bg-shape-1"></div>
        <div class="bg-shape bg-shape-2"></div>
        <div class="bg-shape bg-shape-3"></div>
        <div class="container">
            <h1>${heroTitle}</h1>
            <p>${markdownToHtml(content.hero.description)}</p>
            <a href="${content.hero.ctaLink}" class="cta-button">${content.hero.ctaText}</a>
        </div>
    </section>

    <!-- Challenge Section -->
    <section class="challenge" id="challenge">
        <div class="bg-shape bg-shape-1"></div>
        <div class="bg-shape bg-shape-2"></div>
        <div class="container">
            <h2>${content.challenge.title}</h2>
            
            <div class="challenge-grid">
                ${content.challenge.items.map(item => `
                <div class="challenge-item">
                    <h3>${item.title}</h3>
                    <p>${markdownToHtml(item.description)}</p>
                </div>`).join('\n                ')}
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section class="services" id="services">
        <div class="bg-shape bg-shape-1"></div>
        <div class="bg-shape bg-shape-2"></div>
        <div class="bg-shape bg-shape-3"></div>
        <div class="container">
            <div class="section-header">
                <h2>${content.services.title}</h2>
                <p>${content.services.subtitle}</p>
            </div>
            
            <div class="services-grid">
                ${content.services.items.map((item, index) => {
                    const icons = [
                        `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="30" y="30" width="40" height="40" stroke="#697A92" stroke-width="1.5" fill="none" opacity="0.3"/>
                            <rect x="25" y="25" width="50" height="50" stroke="#314969" stroke-width="1.5" fill="none" opacity="0.6"/>
                            <rect x="20" y="20" width="60" height="60" stroke="#F07B4A" stroke-width="2.5" fill="none"/>
                        </svg>`,
                        `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <clipPath id="leftCircle">
                                    <circle cx="40" cy="50" r="25"/>
                                </clipPath>
                                <clipPath id="rightCircle">
                                    <circle cx="60" cy="50" r="25"/>
                                </clipPath>
                            </defs>
                            <circle cx="40" cy="50" r="25" fill="#F07B4A" clip-path="url(#rightCircle)"/>
                            <circle cx="40" cy="50" r="25" fill="none" stroke="#314969" stroke-width="2"/>
                            <circle cx="60" cy="50" r="25" fill="none" stroke="#314969" stroke-width="2"/>
                        </svg>`,
                        `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="20" y1="65" x2="60" y2="65" stroke="#697A92" stroke-width="1.5" opacity="0.4"/>
                            <line x1="20" y1="50" x2="70" y2="50" stroke="#314969" stroke-width="1.5" opacity="0.7"/>
                            <line x1="20" y1="35" x2="80" y2="35" stroke="#F07B4A" stroke-width="2.5"/>
                            <circle cx="80" cy="35" r="3" fill="#F07B4A"/>
                        </svg>`
                    ];
                    return `
                <div class="service-card">
                    <div class="icon-container">
                        ${icons[index] || icons[0]}
                    </div>
                    <h3>${item.title}</h3>
                    <p>${markdownToHtml(item.description)}</p>
                </div>`;
                }).join('\n                ')}
            </div>
        </div>
    </section>

    <!-- Approach Section -->
    <section class="approach" id="approach">
        <div class="bg-shape bg-shape-1"></div>
        <div class="bg-shape bg-shape-2"></div>
        <div class="bg-shape bg-shape-3"></div>
        <div class="container">
            <div class="section-header">
                <h2>${content.approach.title}</h2>
                <p>${content.approach.subtitle}</p>
            </div>
            
            <div class="services-grid">
                ${content.approach.items.map((item, index) => {
                    const icons = [
                        `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="30" y="30" width="20" height="20" stroke="#697A92" stroke-width="1.5" fill="none" opacity="0.4"/>
                            <rect x="30" y="30" width="35" height="35" stroke="#314969" stroke-width="1.5" fill="none" opacity="0.7"/>
                            <rect x="30" y="30" width="50" height="50" stroke="#F07B4A" stroke-width="2.5" fill="none"/>
                        </svg>`,
                        `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="15" stroke="#697A92" stroke-width="1.5" fill="none" opacity="0.4"/>
                            <circle cx="50" cy="50" r="25" stroke="#314969" stroke-width="1.5" fill="none" opacity="0.7"/>
                            <circle cx="50" cy="50" r="35" stroke="#F07B4A" stroke-width="2.5" fill="none"/>
                        </svg>`,
                        `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="25" y="60" width="15" height="20" stroke="#697A92" stroke-width="1.5" fill="none" opacity="0.4"/>
                            <rect x="45" y="50" width="15" height="30" stroke="#314969" stroke-width="1.5" fill="none" opacity="0.7"/>
                            <rect x="65" y="30" width="15" height="50" stroke="#F07B4A" stroke-width="2.5" fill="none"/>
                            <line x1="20" y1="80" x2="85" y2="80" stroke="#314969" stroke-width="1.5" opacity="0.3"/>
                        </svg>`
                    ];
                    return `
                <div class="service-card">
                    <div class="icon-container">
                        ${icons[index] || icons[0]}
                    </div>
                    <h3>${item.title}</h3>
                    <p>${markdownToHtml(item.description)}</p>
                </div>`;
                }).join('\n                ')}
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
        <div class="bg-shape bg-shape-1"></div>
        <div class="bg-shape bg-shape-2"></div>
        <div class="bg-shape bg-shape-3"></div>
        <div class="container">
            <h2>${content.cta.title}</h2>
            <p>${markdownToHtml(content.cta.description)}</p>
            <a href="${content.cta.buttonLink}" class="cta-button">${content.cta.buttonText}</a>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2026 Vantys SRL. Life Science Business Consulting.</p>
            <p>
                <a href="${content.footer.linkedinUrl}">LinkedIn</a> | 
                <a href="privacy-policy.html">Privacy Policy</a>
            </p>
        </div>
    </footer>

    <script src="script.js"></script>
    <script>
      if (window.netlifyIdentity) {
        window.netlifyIdentity.on("init", user => {
          if (!user) {
            window.netlifyIdentity.on("login", () => {
              document.location.href = "/admin/";
            });
          }
        });
      }
    </script>
</body>
</html>`;

// Write the generated HTML
const htmlPath = path.join(__dirname, 'index.html');
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('✅ HTML generated successfully from CMS content!');