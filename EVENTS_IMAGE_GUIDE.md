# Events & Certificates Image Guide

Complete guide for adding multiple images to your events and certificates section.

## 📁 Directory Structure

Create the following directory structure for event images:

```
assets/
└── events/
    ├── programming-contest/
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   ├── 3.jpg
    │   └── 4.jpg
    ├── certificate-ceremony/
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   ├── 3.jpg
    │   └── 4.jpg
    └── professional-events/
        ├── 1.jpg
        ├── 2.jpg
        ├── 3.jpg
        └── 4.jpg
```

## 🎯 How to Add Images

### Step 1: Create Event Directory

```bash
# Create the events directory structure
mkdir -p assets/events/programming-contest
mkdir -p assets/events/certificate-ceremony
mkdir -p assets/events/professional-events
```

### Step 2: Add Your Images

1. **Naming Convention**: Name your images sequentially (`1.jpg`, `2.jpg`, `3.jpg`, etc.)
2. **Image Format**: Use JPG or PNG format
3. **Image Size**: Recommended 800x600px or similar aspect ratio
4. **File Size**: Keep images under 500KB each for optimal loading

**Example for Programming Contest:**
```bash
# Copy your programming contest certificate images
cp "certificate1.jpg" assets/events/programming-contest/1.jpg
cp "hackathon-winner.jpg" assets/events/programming-contest/2.jpg
cp "code-marathon.jpg" assets/events/programming-contest/3.jpg
```

### Step 3: Test the Gallery

1. Start local server: `python -m http.server 8000`
2. Open `http://localhost:8000` in your browser
3. Navigate to the Events section
4. Click "View Gallery" on any event card
5. You should see your images in a beautiful grid layout

## 🎨 Image Guidelines

### Recommended Image Types

**Programming Contest Events:**
- Contest participation certificates
- Hackathon awards
- Coding competition results
- Team photos from events

**Certificate Ceremonies:**
- Academic achievement certificates
- Award ceremony photos
- Degree certificates
- Recognition ceremony images

**Professional Events:**
- Conference attendance certificates
- Workshop completion certificates
- Networking event photos
- Professional development certificates

### Image Specifications

| Aspect Ratio | Recommended Size | Max File Size |
|---------------|-------------------|----------------|
| 4:3 (Standard) | 800x600px | 500KB |
| 3:2 (Wide) | 900x600px | 500KB |
| 1:1 (Square) | 600x600px | 400KB |

### Image Optimization Tips

1. **Use JPG for photos** - Better compression than PNG for photographs
2. **Use PNG for graphics** - If images have text or simple graphics
3. **Compress before adding** - Use tools like TinyPNG or ImageOptim
4. **Consistent sizing** - Keep all images in the same event similar in size
5. **Good lighting** - Ensure certificates and photos are well-lit and readable

## 🔧 Advanced Customization

### Adding More Than 4 Images

If you have more than 4 images per event, you can:

1. **Add more image files**: Simply add `5.jpg`, `6.jpg`, etc.
2. **Modify the gallery**: The system will automatically detect all images

**Example:**
```bash
# For events with many images
cp img1.jpg assets/events/programming-contest/1.jpg
cp img2.jpg assets/events/programming-contest/2.jpg
# ... add up to 10 images
```

### Custom Event Categories

To add a new event category, follow these steps:

1. **Create directory for new event**:
```bash
mkdir -p assets/events/your-new-event
```

2. **Add the event card HTML** in `index.html`:
```html
<div class="event-card" data-event="your-new-event">
  <div class="event-image-gallery">
    <div class="event-gallery-main">
      <i class="fas fa-icon-name"></i>
    </div>
    <div class="event-gallery-thumbnails" data-images="[]">
      <span class="no-images">Add images to assets/events/your-new-event/</span>
    </div>
  </div>
  <div class="event-content">
    <h3>Your Event Title</h3>
    <p>Event description here</p>
    <div class="event-meta">
      <span class="event-date">Date info</span>
      <span class="event-category">Category</span>
    </div>
    <button class="event-view-btn" data-event="your-new-event">
      <i class="fas fa-certificate"></i> View Gallery
    </button>
  </div>
</div>
```

3. **Add event data** to the JavaScript:
```javascript
'your-new-event': {
  title: 'Your Event Title',
  description: 'Detailed description of the event...',
  date: 'Event date',
  category: 'Event Category',
  images: null
}
```

## 🖼️ Gallery Features

### What the Gallery System Does

1. **Auto-loads Images**: Automatically finds images in event folders
2. **Thumbnail Navigation**: Shows thumbnails of all images
3. **Click to View**: Click any thumbnail to view it larger
4. **Smooth Animations**: Beautiful transitions between images
5. **Responsive Design**: Works perfectly on mobile and desktop
6. **Fallback System**: Shows placeholder if no images found

### Gallery Interaction

**For Users:**
- Click "View Gallery" button on any event card
- See all images in a beautiful grid layout
- Click any image to view it as the main image
- Navigate between different images
- Close modal with X button, clicking outside, or pressing Escape

**For Developers:**
- Simply drop images into the correct folder
- System automatically detects and displays them
- No coding required after initial setup
- Supports unlimited images per event

## 📱 Testing & Troubleshooting

### Testing Locally

1. **Start server**: `python -m http.server 8000`
2. **Test gallery**: Click through each event's gallery
3. **Verify images**: Ensure all images load correctly
4. **Test navigation**: Click thumbnails and verify main image updates

### Common Issues

**Issue**: Images not loading
- **Solution**: Ensure you're using a local server, not opening file directly
- **Solution**: Check image paths match the expected structure

**Issue**: Images appear distorted
- **Solution**: Use consistent aspect ratios for all images in same event
- **Solution**: Crop images to recommended sizes before adding

**Issue**: Gallery shows placeholders
- **Solution**: Verify images are in the correct directory: `assets/events/event-name/`
- **Solution**: Ensure image files are named `1.jpg`, `2.jpg`, etc.

## 🎉 Best Practices

1. **Organize by Event**: Keep images for different events in separate folders
2. **Quality Over Quantity**: Add high-quality, relevant images only
3. **Consistent Styling**: Use similar image sizes and styles within each event
4. **Regular Updates**: Add new images as you participate in more events
5. **Backup Images**: Keep original high-quality versions of important certificates

## 📝 Maintenance

### Monthly Tasks
- [ ] Add new event images from recent events
- [ ] Remove outdated or irrelevant images
- [ ] Optimize image file sizes
- [ ] Update event descriptions as needed

### When to Update Images
- After participating in new events
- When receiving new certificates
- After attending conferences or workshops
- When updating professional achievements

---

**Need Help?** If you encounter any issues with the gallery system, check:
1. Directory structure matches the guide
2. Image filenames follow the pattern (1.jpg, 2.jpg, etc.)
3. You're using a local server for testing
4. Images are in the correct event folder