# Róbert's Campaign Website

A modern, responsive political campaign website for Róbert's candidacy with Viðreisn in the Reykjavík City Elections.

## Features

- **Hero Section**: Eye-catching introduction with Róbert's photo and mission
- **News Section**: Latest campaign news and announcements
- **Articles Section**: In-depth articles and policy positions
- **Videos Section**: Campaign videos and interviews
- **Contact Section**: Easy ways to get in touch and support the campaign
- **Fully Responsive**: Works beautifully on all devices

## Getting Started

1. **Add Images**: Place Róbert's photos and other images in the `images/` folder
   - `robert-hero.jpg` - Main hero image (portrait orientation recommended)
   - Additional images for news, articles, and videos

2. **Open the Website**: Simply open `index.html` in your web browser

3. **Add Content**: Use the JavaScript functions to add dynamic content:
   ```javascript
   // Add a news item
   addNewsItem({
       title: 'Your news title',
       excerpt: 'Brief description',
       date: '10. janúar 2026',
       image: 'images/news1.jpg'
   });
   
   // Add an article
   addArticle({
       title: 'Article title',
       excerpt: 'Article summary',
       date: '8. janúar 2026',
       link: 'https://link-to-full-article.com'
   });
   
   // Add a video
   addVideo({
       title: 'Video title',
       description: 'Video description',
       url: 'https://youtube.com/watch?v=...',
       thumbnail: 'images/video-thumb.jpg'
   });
   ```

## Customization

### Colors
The website uses Viðreisn-inspired colors defined in `styles.css`:
- Primary Orange: `#FF6B35`
- Secondary Blue: `#004E89`
- Accent Blue: `#1A659E`

### Contact Information
Update the email address in `index.html` (line with `mailto:`) to Róbert's actual email.

### Social Media
Add social media links in the contact section by editing the `.social-links` div in `index.html`.

## File Structure

```
robertweb/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # JavaScript functionality
├── images/             # Image folder (add your images here)
└── README.md           # This file
```

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Next Steps

1. Add Róbert's photos to the `images/` folder
2. Update contact email and add social media links
3. Start adding news, articles, and videos using the JavaScript functions
4. Deploy to a web hosting service when ready

---

Built with modern web technologies for a premium, professional campaign presence.
