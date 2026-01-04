# UI Update: Lovecraftian Theme Toggle

**Date:** January 2026
**Version:** 1.0

---

## Overview

Added a theme toggle system allowing users to switch between the original neon/metal aesthetic and a new Lovecraftian cosmic horror theme. Theme preference persists via localStorage.

---

## New Features

### Theme Toggle Button
- Fixed position: top-right corner
- Icons: 🐙 ELDRITCH / 🔥 METAL
- Pulse animation in Lovecraftian mode

### Lovecraftian Visual Effects
- **Starfield overlay** - CSS-generated stars with slow cosmic drift (120s cycle)
- **Rising fog** - Gradient mist crawling up from bottom (25s cycle)
- **Gothic typography** - Crimson Text (body) + IM Fell English (headers)
- **Eerie glow** - Teal/purple drop-shadows on logo, images, nav links
- **Christmas lights** - Hidden in Lovecraftian mode

---

## Color Palettes

| Element | Default (Metal) | Lovecraftian |
|---------|-----------------|--------------|
| Background | `#000000` | `#0a0a12` (abyssal) |
| Text | `#ffffff` | `#c4c4b8` (parchment) |
| Primary accent | `#00ffff` (cyan) | `#3d7a7a` (bioluminescent) |
| Secondary accent | `#f70094` (magenta) | `#4a1a4a` (eldritch purple) |
| Hover | `orange` | `#3d5a5a` (murky teal) |
| Links hover | `rgb(162,68,68)` | `#5a8a8a` (spectral) |

---

## Files Changed

### New Files
```
frontend/src/
├── context/ThemeContext.js          # Theme state + localStorage
└── components/ThemeToggle/
    ├── ThemeToggle.js               # Toggle button component
    └── ThemeToggle.css              # Toggle styling
```

### Modified Files
```
frontend/
├── public/index.html                # Google Fonts added
└── src/
    ├── index.css                    # CSS variables (both themes)
    └── components/
        ├── App/App.js               # ThemeProvider wrapper
        ├── App/App.css              # Starfield + fog overlays
        ├── NavBar/NavBar.css
        ├── Header/Header.css
        ├── Footer/Footer.css
        ├── SocialMediaBar/SocialMediaBar.css
        ├── FloatingCartButton/FloatingCartButton.css
        ├── MerchCart/MerchCart.css
        ├── Templates/FancyBorder.css
        └── Pages/
            ├── Home/Home.css
            ├── About/About.css
            ├── Shows/Shows.css
            ├── Contact/Contact.css
            ├── Merch/Merch.css
            ├── Merch/StoreItem/StoreItem.css
            └── Chat/Chat.css
```

---

## Technical Implementation

### Theme Context
```javascript
// Usage in any component:
import { useTheme } from '../../context/ThemeContext';

const { theme, toggleTheme, isLovecraftian } = useTheme();
```

### CSS Variables
```css
/* Access theme colors anywhere: */
color: var(--color-text-primary);
background: var(--color-bg-primary);
```

### Theme Detection
```css
/* Target Lovecraftian-only styles: */
[data-theme="lovecraftian"] .my-element {
    /* styles */
}
```

---

## Accessibility

- Theme toggle has `aria-label` for screen readers
- `prefers-reduced-motion` media query disables animations
- Sufficient color contrast maintained in both themes

---

## Future Enhancements

- [ ] Custom background images (starfield texture, eldritch patterns)
- [ ] Lovecraftian-styled Maldevera logo variant
- [ ] Tentacle border decorations
- [ ] More atmospheric sound effects integration
