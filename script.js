// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Sticky header scroll effect
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
});

// Back to top button functionality
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── Count-up animation for proof stats ──────────────────────────────────────
function parseStatValue(text) {
    const clean = text.trim();
    const sign   = clean.startsWith('+') ? '+' : clean.startsWith('−') || clean.startsWith('-') ? '−' : '';
    const noSign = clean.replace(/^[+\-−]/, '');
    const match  = noSign.match(/^([\d.]+)(.*)/);
    if (!match) return null;
    return {
        number: parseFloat(match[1]),
        suffix: match[2] || '',
        sign,
        original: clean
    };
}

function animateCountUp(el) {
    const parsed = parseStatValue(el.textContent);
    if (!parsed) return;
    const duration = 1800;
    const start    = performance.now();
    const isFloat  = parsed.number % 1 !== 0;

    function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = parsed.number * eased;
        const display  = isFloat ? current.toFixed(1) : Math.round(current);
        el.textContent = parsed.sign + display + parsed.suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = parsed.original;
    }
    requestAnimationFrame(step);
}

// Trigger when the proof section enters viewport
const proofNumbers = document.querySelectorAll('.proof-number');
if (proofNumbers.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                proofNumbers.forEach(el => animateCountUp(el));
                observer.disconnect();
            }
        });
    }, { threshold: 0.4 });

    const proofSection = document.querySelector('.proof-section');
    if (proofSection) observer.observe(proofSection);
}
