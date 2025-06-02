# Scroll-Controlled Features

This document explains the new scroll-controlled features implemented for text chapters:

## 1. Scroll-Controlled Video Background

### Overview
The `ScrollVideoBackground` component allows videos to play forward when scrolling down and backward when scrolling up. The video playback is synchronized with the scroll position.

### Usage

In your text chapters, use the `backgroundVideo` prop instead of `backgroundImage`:

```tsx
<TextChapter
  {...props}
  content="Your chapter content..."
  backgroundVideo="/videos/your-video.mp4"
/>
```

### Video Requirements
- **Format**: MP4 is recommended for best compatibility
- **Duration**: Longer videos work better for longer chapters
- **Optimization**: Use compressed videos to reduce loading time
- **Attributes**: Videos are automatically muted and set to not autoplay

### How It Works
- Video playback is controlled by scroll position
- Scrolling down plays the video forward
- Scrolling up plays the video backward
- Video time is mapped to scroll progress through the chapter
- Performance optimized with requestAnimationFrame

## 2. Scroll Fade-In Text Animation

### Overview
The `ScrollFadeText` component replaces all previous text effects and provides a smooth fade-in animation as text becomes visible during scrolling.

### Features
- Text fades in with a subtle upward motion
- Animation triggers when text becomes visible
- Each text block animates independently
- Once animated, text remains visible (doesn't re-animate)

### Customization Options

```tsx
<ScrollFadeText
  threshold={0.2}  // Percentage of element visible to trigger (0.0-1.0)
  delay={0}        // Delay in milliseconds before animation starts
  className="custom-class"
>
  Your content here
</ScrollFadeText>
```

### Migration from Previous Text Effects
- All `textEffect` properties are now ignored
- Typewriter effects are replaced with scroll fade-in
- This change applies globally to all text chapters

## 3. Text Readability Overlay

### Overview
A 50% opacity black overlay is automatically applied between the background and text content to ensure optimal readability.

### Features
- **Automatic**: Applied to all chapters with backgrounds
- **Optimized Opacity**: 50% provides good contrast without being too dark
- **Fixed Positioning**: Covers the entire viewport consistently
- **Z-Index Management**: Positioned between background (-z-10) and content (z-10)

### Customization
The overlay is currently fixed at 50% opacity. To modify this, edit the `BookPage.tsx` component:

```tsx
{/* Black Overlay for text readability */}
<div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-50 -z-5" />
```

## 4. Intelligent Audio Autoplay

### Overview
The `ChapterAudio` component provides background audio with intelligent autoplay that respects user preferences and browser policies.

### Usage

```tsx
<TextChapter
  {...props}
  content="Your chapter content..."
  backgroundAudio="/audio/your-audio.mp3"
/>
```

### Features
- **Smart Autoplay**: Automatically plays if user has previously allowed audio
- **User Permission Memory**: Remembers audio preference in localStorage
- **Graceful Fallback**: Shows play button if autoplay is blocked
- **Audio Controls**: Fixed play/pause button in top-right corner
- **First-time Prompt**: Elegant modal for first-time audio permission

### Audio Requirements
- **Format**: MP3, WAV, or OGG supported
- **Loop**: Audio automatically loops by default
- **Volume**: Default volume set to 30% (0.3)
- **Optimization**: Use compressed audio files for faster loading

### Customization Options

```tsx
<ChapterAudio 
  audioSrc="/audio/background.mp3"
  loop={true}        // Whether to loop the audio
  volume={0.3}       // Volume level (0.0 - 1.0)
/>
```

### How It Works
1. **First Visit**: Shows permission modal if audio is available
2. **Permission Granted**: Stores preference in localStorage
3. **Future Visits**: Automatically attempts to play audio
4. **User Control**: Always provides play/pause button for manual control
5. **Interaction Detection**: Enables autoplay after any user interaction

## 5. Implementation Details

### Files Created
- `src/book/effects/ScrollVideoBackground.tsx` - Video background component
- `src/book/effects/ScrollFadeText.tsx` - Text fade-in component
- `src/book/effects/ChapterAudio.tsx` - Audio management component

### Files Modified
- `src/book/types.ts` - Added `backgroundVideo` and `backgroundAudio` props
- `src/book/templates/BookPage.tsx` - Added video background and overlay support
- `src/book/templates/TextChapter.tsx` - Integrated scroll animations and audio
- `src/book/chapters/ExampleChapterWithAudio.tsx` - Complete feature demonstration

### Performance Considerations
- Video background uses Intersection Observer for efficient scroll tracking
- Text animations use Intersection Observer to trigger only when needed
- RequestAnimationFrame prevents scroll jank
- Videos are loaded with `preload="metadata"` for faster initial loading
- Audio uses `preload="auto"` for immediate playback readiness

## 6. Browser Support
- Modern browsers with Intersection Observer support
- Video element support required for video backgrounds
- Web Audio API support for audio features
- LocalStorage support for preference memory
- Fallback to static images if video fails to load

## 7. Examples

### Complete Immersive Chapter
```tsx
export default function MyChapter(props: BookChapterProps) {
  return (
    <TextChapter
      {...props}
      content={`
        An immersive chapter with all features enabled.
        
        Video background, audio, and smooth text animations
        create an engaging reading experience.
      `}
      backgroundVideo="/videos/my-background.mp4"
      backgroundAudio="/audio/ambient-music.mp3"
    />
  );
}
```

### Video Background Only
```tsx
export default function MyChapter(props: BookChapterProps) {
  return (
    <TextChapter
      {...props}
      content="Chapter with video background and text overlay..."
      backgroundVideo="/videos/my-background.mp4"
    />
  );
}
```

### Audio Background Only
```tsx
export default function MyChapter(props: BookChapterProps) {
  return (
    <TextChapter
      {...props}
      content="Chapter with background music..."
      backgroundImage="/images/my-background.jpg"
      backgroundAudio="/audio/background-music.mp3"
    />
  );
}
```

## 8. File Organization

### Recommended Directory Structure
```
public/
├── videos/
│   ├── chapter1-background.mp4
│   ├── ambient-scene.mp4
│   └── ...
├── audio/
│   ├── background-music.mp3
│   ├── ambient-sounds.mp3
│   └── ...
└── images/
    ├── fallback-backgrounds/
    └── ...
```

## 9. Troubleshooting

### Video Not Playing
- Check video file path and format
- Ensure video is accessible from the public directory
- Check browser console for loading errors

### Audio Not Playing
- Check audio file path and format
- Verify browser autoplay policies
- Check if localStorage is available
- Test audio controls manually

### Text Not Fading In
- Ensure content is long enough to trigger scroll
- Check that Intersection Observer is supported
- Verify no CSS conflicts with opacity/transform

### Overlay Too Dark/Light
- Modify the `bg-opacity-50` class in BookPage.tsx
- Consider different opacity values for different backgrounds

### Performance Issues
- Use compressed video and audio files
- Consider shorter videos for better performance
- Test on various devices and browsers
- Monitor memory usage with multiple media files 