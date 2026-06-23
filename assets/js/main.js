const safeGet = (key) => {
    try {
        return window.localStorage.getItem(key);
    } catch (e) {
        return null;
    }
};

const syncBrandAlignment = () => {
    document.querySelectorAll('a[href="index.html"] svg[viewBox="0 0 180 50"] text').forEach((text) => {
        text.setAttribute('direction', 'ltr');
        text.setAttribute('unicode-bidi', 'bidi-override');
        text.setAttribute('text-anchor', 'start');
    });
};

// Apply persisted UI preferences globally (all pages using main.js)
(() => {
    const savedDirection = safeGet('site-direction');
    document.documentElement.setAttribute('dir', savedDirection === 'rtl' ? 'rtl' : 'ltr');

    const savedTheme = safeGet('site-theme');
    const isDark = savedTheme === 'dark';
    document.body.classList.toggle('theme-dark', isDark);

    document.querySelectorAll('#theme-toggle, .theme-toggle').forEach(el => {
        el.innerHTML = isDark ? '<i class="fas fa-sun text-base"></i>' : '<i class="fas fa-moon text-base"></i>';
    });

    document.querySelectorAll('#rtl-toggle, .rtl-toggle').forEach(el => {
        el.innerHTML = '<i class="fas fa-language text-base"></i>';
    });

    syncBrandAlignment();
})();

window.toggleTheme = function toggleTheme() {
    const isDark = !document.body.classList.contains('theme-dark');
    document.body.classList.toggle('theme-dark', isDark);

    try {
        window.localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
    } catch (e) {
        // Ignore localStorage write errors.
    }

    document.querySelectorAll('#theme-toggle, .theme-toggle').forEach(el => {
        el.innerHTML = isDark ? '<i class="fas fa-sun text-base"></i>' : '<i class="fas fa-moon text-base"></i>';
    });
};

window.toggleRTL = function toggleRTL() {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    const nextDirection = isRTL ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', nextDirection);

    try {
        window.localStorage.setItem('site-direction', nextDirection);
    } catch (e) {
        // Ignore localStorage write errors.
    }

    document.querySelectorAll('#rtl-toggle, .rtl-toggle').forEach(el => {
        el.innerHTML = '<i class="fas fa-language text-base"></i>';
    });

    syncBrandAlignment();
};

// Initialize AOS (guarded)
if (window.AOS) {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });
}

// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    // Hero Entrance
    if (window.gsap && document.querySelector(".hero-content > *")) {
        gsap.from(".hero-content > *", {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    }

    // Safety Impact Particle Effect
    const createImpactSpark = (e) => {
        const spark = document.createElement('div');
        spark.className = 'fixed pointer-events-none text-caramel/10 z-[60]';
        spark.innerHTML = '<i class="fas fa-helmet-safety"></i>';
        spark.style.left = `${e.clientX}px`;
        spark.style.top = `${e.clientY}px`;
        spark.style.fontSize = `${Math.random() * 20 + 10}px`;
        spark.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        document.body.appendChild(spark);
        
        if (window.gsap) {
            gsap.to(spark, {
                opacity: 0,
                y: -50,
                duration: 1,
                onComplete: () => spark.remove()
            });
        } else {
            spark.remove();
        }
    };
});

// Navbar Logic
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled', 'py-4');
        navbar.classList.remove('py-6');
    } else {
        navbar.classList.remove('scrolled', 'py-4');
        navbar.classList.add('py-6');
    }
});

// Active nav link state (desktop + mobile)
const applyActiveNavState = () => {
    const fileName = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const activeByPage = {
        'index.html': 'index.html',
        'home-2.html': 'home-2.html',
        'about.html': 'about.html',
        'gallery.html': 'gallery.html',
        'blog.html': 'blog.html',
        'contact.html': 'contact.html'
    };

    const activeHref = activeByPage[fileName] || null;

    document.querySelectorAll('#navbar .nav-link').forEach((link) => {
        link.classList.remove('text-caramel');
        if (activeHref && link.getAttribute('href') === activeHref) {
            link.classList.add('text-caramel');
        }
    });

    document.querySelectorAll('#mobile-menu a[href]').forEach((link) => {
        link.classList.remove('text-caramel');
        if (activeHref && link.getAttribute('href') === activeHref) {
            link.classList.add('text-caramel');
        }
    });
};

applyActiveNavState();

// Mobile Menu
const mobileBtn = document.getElementById('mobile-menu-btn');
let mobileMenu = document.getElementById('mobile-menu');

if (!mobileMenu) {
    mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobile-menu';
    mobileMenu.className = 'fixed inset-0 bg-charcoal/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-start pt-24 pb-10 gap-6 text-xl text-white overflow-y-auto transform translate-x-full transition-transform duration-500 hidden';
    mobileMenu.innerHTML = `
        <button class="absolute top-10 right-10 text-4xl" id="close-menu">
            <i class="fas fa-times"></i>
        </button>
        <a href="index.html" class="hover:text-caramel transition-colors">Home 1</a>
        <a href="home-2.html" class="hover:text-caramel transition-colors">Home 2</a>
        <a href="about.html" class="hover:text-caramel transition-colors">About</a>
        <a href="gallery.html" class="hover:text-caramel transition-colors">Projects</a>
        <a href="blog.html" class="hover:text-caramel transition-colors">Blog</a>
        <a href="contact.html" class="hover:text-caramel transition-colors">Contact</a>
        <div class="mt-4 flex items-center gap-3">
            <button type="button" class="rtl-toggle w-10 h-10 inline-flex items-center justify-center rounded-full border border-caramel bg-white/90 text-sm font-semibold text-caramel shadow-sm transition-all hover:bg-caramel hover:text-white" onclick="toggleRTL()" aria-label="Toggle RTL/LTR">
                <i class="fas fa-language text-base"></i>
            </button>
            <button type="button" class="theme-toggle w-10 h-10 inline-flex items-center justify-center rounded-full border border-caramel bg-white/90 text-sm font-semibold text-caramel shadow-sm transition-all hover:bg-caramel hover:text-white" onclick="toggleTheme()" aria-label="Toggle Theme">
                <i class="fas fa-moon text-base"></i>
            </button>
            <a href="login.html" class="inline-flex items-center justify-center rounded-full bg-caramel px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-caramel/90">Login</a>
        </div>
    `;
    document.body.appendChild(mobileMenu);
}

applyActiveNavState();

if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
        setTimeout(() => mobileMenu.classList.remove('translate-x-full'), 10);
    });
}

document.addEventListener('click', (e) => {
    if (e.target.id === 'close-menu' || e.target.closest('#close-menu')) {
        mobileMenu.classList.add('translate-x-full');
        setTimeout(() => mobileMenu.classList.add('hidden'), 500);
    }
});

// Project Card Hover Sound (Optional/Mock)
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        // play impact sound logic here
    });
});
