const fs = require('fs');
const path = require('path');

// Read the content JSON
const contentPath = path.join(__dirname, 'content', 'homepage.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

// Read the HTML template
const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace content in HTML
// Hero section
html = html.replace(
  /<h1>.*?<strong>.*?<\/strong><\/h1>/s,
  `<h1>${content.hero.title} <strong>${content.hero.titleHighlight}</strong></h1>`
);

html = html.replace(
  /<section class="hero">[\s\S]*?<p>(.*?)<\/p>/,
  `<section class="hero">
        <div class="container">
            <h1>${content.hero.title} <strong>${content.hero.titleHighlight}</strong></h1>
            <p>${content.hero.description}</p>`
);

html = html.replace(
  /<a href="contact\.html" class="cta-button">.*?<\/a>/,
  `<a href="${content.hero.ctaLink}" class="cta-button">${content.hero.ctaText}</a>`
);

// Challenge section
html = html.replace(
  /<section class="challenge"[\s\S]*?<h2>.*?<\/h2>/,
  `<section class="challenge" id="challenge">
        <div class="container">
            <h2>${content.challenge.title}</h2>`
);

// Replace challenge items
const challengeItems = content.challenge.items.map(item => `
                <div class="challenge-item">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>`
).join('\n');

html = html.replace(
  /<div class="challenge-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/,
  `<div class="challenge-grid">${challengeItems}
            </div>
        </div>
    </section>`
);

// Services section
html = html.replace(
  /<section class="services"[\s\S]*?<h2>.*?<\/h2>\s*<p>.*?<\/p>/,
  `<section class="services" id="services">
        <div class="container">
            <div class="section-header">
                <h2>${content.services.title}</h2>
                <p>${content.services.subtitle}</p>`
);

// Approach section
html = html.replace(
  /<section class="approach"[\s\S]*?<h2>.*?<\/h2>\s*<p>.*?<\/p>/,
  `<section class="approach" id="approach">
        <div class="container">
            <div class="section-header">
                <h2>${content.approach.title}</h2>
                <p>${content.approach.subtitle}</p>`
);

// CTA section
html = html.replace(
  /<section class="cta-section">[\s\S]*?<h2>.*?<\/h2>\s*<p>.*?<\/p>\s*<a.*?>.*?<\/a>/,
  `<section class="cta-section">
        <div class="container">
            <h2>${content.cta.title}</h2>
            <p>${content.cta.description}</p>
            <a href="${content.cta.buttonLink}" class="cta-button">${content.cta.buttonText}</a>`
);

// Footer
html = html.replace(
  /<footer>[\s\S]*?<p>&copy;.*?<\/p>\s*<p><a href=".*?">.*?<\/a><\/p>/,
  `<footer>
        <div class="container">
            <p>${content.footer.copyright}</p>
            <p><a href="${content.footer.linkedinUrl}">LinkedIn</a></p>`
);

// Write the updated HTML
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('✅ HTML updated successfully from CMS content!');