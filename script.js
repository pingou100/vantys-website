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

const prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Hero living equalizer waveform ──────────────────────────────────────────
(function heroWaveform() {
    const canvas = document.getElementById('heroWave');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const navy = [49, 73, 105], coral = [240, 123, 74], golden = [242, 175, 76];
    const intensity = 3, speed = 1, accents = true;

    function resize() {
        const r = canvas.getBoundingClientRect();
        canvas.width = Math.max(1, Math.round(r.width * dpr));
        canvas.height = Math.max(1, Math.round(r.height * dpr));
    }
    resize();
    window.addEventListener('resize', resize);

    function roundRect(x, y, w, h, r) {
        r = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    let t = 0;
    function frame() {
        const W = canvas.width / dpr, H = canvas.height / dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);

        const step = 30, barW = 12;
        const n = Math.ceil(W / step) + 1;
        const baseFrac = 0.16, ampFrac = 0.12 + intensity * 0.07;

        for (let i = 0; i < n; i++) {
            const x = i * step;
            const w1 = Math.sin(i * 0.32 - t * 0.9 * speed);
            const w2 = Math.sin(i * 0.11 + t * 0.5 * speed);
            const nrm = w1 * 0.6 + w2 * 0.4;
            const h = H * (baseFrac + (nrm * 0.5 + 0.5) * ampFrac);
            let col = navy, a = 0.07;
            if (accents) {
                const m = i % 7;
                if (m === 2) { col = coral; a = 0.12; }
                else if (m === 5) { col = golden; a = 0.12; }
            }
            ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + a + ')';
            roundRect(x, H - h, barW, h, barW / 2);
            ctx.fill();
        }
        if (!prefersReducedMotion) { t += 0.016; requestAnimationFrame(frame); }
    }
    frame();
})();

// ── Digital & AI icon: coral climbs bottom → middle → dwells on top + circle ──
(function digitalAiIcon() {
    const bottom = document.getElementById('vtyI3Bottom');
    const mid    = document.getElementById('vtyI3Mid');
    const top    = document.getElementById('vtyI3Top');
    const dot    = document.getElementById('vtyI3Dot');
    if (!bottom || !mid || !top || !dot) return;

    const GRAY = [105, 122, 146], NAVY = [49, 73, 105], CORAL = [240, 123, 74];
    const topDwell = 0.5, edge = 0.06, base = 4.2;
    const a2 = 1 - topDwell, a1 = a2 * 0.5;

    const lerp = (A, B, f) => 'rgb(' +
        Math.round(A[0] + (B[0] - A[0]) * f) + ',' +
        Math.round(A[1] + (B[1] - A[1]) * f) + ',' +
        Math.round(A[2] + (B[2] - A[2]) * f) + ')';
    const band = (x, s, e) => {
        if (x < s - edge || x > e + edge) return 0;
        if (x < s) return (x - (s - edge)) / edge;
        if (x > e) return 1 - (x - e) / edge;
        return 1;
    };

    function render(p) {
        const bc = band(p, 0, a1), mc = band(p, a1, a2);
        let tc;
        if (p < a2 - edge) tc = 0;
        else if (p < a2) tc = (p - (a2 - edge)) / edge;
        else tc = 1;
        if (p > 1 - edge) tc = Math.min(tc, 1 - (p - (1 - edge)) / edge);
        bottom.style.stroke = lerp(GRAY, CORAL, bc);
        mid.style.stroke = lerp(NAVY, CORAL, mc);
        top.style.stroke = lerp(NAVY, CORAL, tc);
        dot.style.opacity = String(tc);
        dot.style.transform = 'scale(' + (0.5 + 0.5 * tc) + ')';
    }

    if (prefersReducedMotion) { render(0.62); return; }

    let phase = 0, last = null;
    function step(now) {
        if (last == null) last = now;
        phase = (phase + (now - last) / 1000 / base) % 1;
        last = now;
        render(phase);
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
})();
