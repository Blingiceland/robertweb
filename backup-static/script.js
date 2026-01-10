// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.news-card, .article-card, .video-card').forEach(card => {
    observer.observe(card);
});

// Dynamic content management
const contentData = {
    news: [],
    articles: [],
    videos: []
};

// Function to add news item
function addNewsItem(item) {
    contentData.news.push(item);
    renderNews();
}

// Function to add article
function addArticle(article) {
    contentData.articles.push(article);
    renderArticles();
}

// Function to add video
function addVideo(video) {
    contentData.videos.push(video);
    renderVideos();
}

// Render news items
function renderNews() {
    const newsGrid = document.getElementById('newsGrid');

    if (contentData.news.length === 0) {
        return; // Keep placeholder
    }

    newsGrid.innerHTML = contentData.news.map(item => `
        <div class="news-card">
            <div class="news-card-image">
                ${item.image ? `<img src="${item.image}" alt="${item.title}">` : '<div class="placeholder-image"></div>'}
            </div>
            <div class="news-card-content">
                <span class="news-date">${item.date}</span>
                <h3 class="news-title">${item.title}</h3>
                <p class="news-excerpt">${item.excerpt}</p>
            </div>
        </div>
    `).join('');

    // Re-observe new cards
    document.querySelectorAll('.news-card').forEach(card => observer.observe(card));
}

// Render articles
function renderArticles() {
    const articlesGrid = document.getElementById('articlesGrid');

    if (contentData.articles.length === 0) {
        return; // Keep placeholder
    }

    articlesGrid.innerHTML = contentData.articles.map(article => `
        <div class="article-card">
            <div class="article-card-content">
                <span class="article-date">${article.date}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                ${article.link ? `<a href="${article.link}" class="article-link" target="_blank">Lesa meira →</a>` : ''}
            </div>
        </div>
    `).join('');

    // Re-observe new cards
    document.querySelectorAll('.article-card').forEach(card => observer.observe(card));
}

// Render videos
function renderVideos() {
    const videosGrid = document.getElementById('videosGrid');

    if (contentData.videos.length === 0) {
        return; // Keep placeholder
    }

    videosGrid.innerHTML = contentData.videos.map(video => `
        <div class="video-card" onclick="window.open('${video.url}', '_blank')">
            <div class="video-thumbnail">
                ${video.thumbnail ? `<img src="${video.thumbnail}" alt="${video.title}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;">` : '<div class="placeholder-image"></div>'}
                <div class="play-button">▶</div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-description">${video.description}</p>
            </div>
        </div>
    `).join('');

    // Re-observe new cards
    document.querySelectorAll('.video-card').forEach(card => observer.observe(card));
}

// Example: How to add content programmatically
// Uncomment and modify these examples when you have real content


addArticle({
    title: '30 milljarðar í útsvar en engin rödd í kosningum',
    excerpt: 'Grein um fjármál borgarinnar og mikilvægi þess að raddir íbúa heyrist.',
    date: 'Janúar 2026',
    link: '#' // Link to document if hosted, or page
});

addArticle({
    title: '31 borgarfulltrúi á launum í Reykjavík',
    excerpt: 'Umræða um fjölda borgarfulltrúa og kostnað við stjórnkerfið.',
    date: 'Janúar 2026',
    link: '#'
});

addArticle({
    title: 'Verum ekki föst',
    excerpt: 'Hvatning til að leita nýrra lausna og festast ekki í gömlum hjólförum.',
    date: 'Janúar 2026',
    link: '#'
});

addArticle({
    title: 'Frelsi til að taka ákvörðun',
    excerpt: 'Um mikilvægi valfrelsis og sjálfstæðis í ákvörðunartöku.',
    date: 'Janúar 2026',
    link: '#'
});

addArticle({
    title: 'Þrjú slys á sama stað en svarið er...',
    excerpt: 'Gagnrýni á viðbrögð borgarinnar við umferðaröryggismálum.',
    date: 'Janúar 2026',
    link: '#'
});

// Check for hero image
const heroImage = document.getElementById('heroImage');
if (heroImage && !heroImage.src) {
    heroImage.style.display = 'none';
}

// Log ready message
console.log('Róbert\'s campaign website loaded successfully!');
console.log('Use addNewsItem(), addArticle(), and addVideo() functions to add content.');
