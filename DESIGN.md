# Mediterranean Clay Design System

### 1. Overview & Creative North Star
**Creative North Star: "The Heritage Archivist"**
Mediterranean Clay is a design system that bridges the gap between ancient tactile craftsmanship and modern digital precision. It rejects the "clean-tech" aesthetic in favor of a "High-End Editorial" experience that feels curated, academic, yet deeply warm. The system prioritizes large, expressive typography and intentional whitespace to allow visual content—the "artisan's work"—to breathe. It utilizes a "No-Line" philosophy, where the structure is dictated by light and shadow rather than rigid borders.

### 2. Colors
The palette is rooted in the earth (Terracotta #ec4913) and sun-bleached surfaces (#fdfbf7). 
- **Primary & Secondary:** Used for high-priority actions and calls to heritage.
- **The "No-Line" Rule:** 1px solid borders are strictly prohibited for defining layout sections. Instead, use a shift from `surface` to `surface_container_low` to mark transitions.
- **Surface Hierarchy:** Depth is achieved by "nesting" containers. For example, a card (`surface_container_lowest`) sits on a background (`surface_container`).
- **Glass & Gradient Rule:** Navigation and floating overlays must use backdrop-blur (minimum 20px) and a 90% opacity white/surface fill to maintain context of the background.
- **Signature Textures:** Implement a subtle "noise" or "grain" overlay at 15% opacity on large color blocks to mimic the texture of raw clay or paper.

### 3. Typography
The system uses a high-contrast pairing of a sophisticated Serif for storytelling and a clean, wide Sans-Serif for utility.
- **Display & Headline (Newsreader/Playfair):** Uses large sizes (up to 3.75rem / 60px) with tight tracking (-0.033em) for a bold, editorial feel. 
- **Body & Label (Plus Jakarta Sans):** Optimized for readability at 1.125rem (18px) for primary body text. 
- **Hierarchy Values:**
    - **Display Large:** 3.75rem (60px) - Bold/Black
    - **Headline Medium:** 2.25rem (36px) - Serif
    - **Body Medium:** 1.125rem (18px) - Sans-Serif
    - **Label Small:** 0.75rem (12px) - Bold Uppercase (Tracking: 0.1em)

### 4. Elevation & Depth
Elevation is communicated through soft, atmospheric shadows rather than sharp edges.
- **The Layering Principle:** Content should feel "stacked." A navigation bar at the top should use `backdrop-blur` and `shadow-sm`.
- **Ambient Shadows:**
    - **Low (Cards):** `0 1px 3px 0 rgba(0, 0, 0, 0.1)` (shadow-sm)
    - **Medium (Tooltips):** `0 4px 6px -1px rgba(0, 0, 0, 0.1)` (shadow-md)
    - **High (Modals/Hero):** `0 25px 50px -12px rgba(0, 0, 0, 0.25)` (shadow-2xl)
- **Glassmorphism:** Essential for maps and multimedia overlays. Use a combination of a subtle white `outline_variant` at 20% opacity and high-radius blur to simulate frosted glass.

### 5. Components
- **Buttons:** Large, pill-shaped (`rounded-full`) with 14px tracking for uppercase text. Primary buttons use #ec4913; secondary buttons use a 2px border and the primary text color.
- **Filter Chips:** Use `surface_container_low` with a subtle hover transition to #ec4913.
- **Cards:** No borders. Cards are defined by their `surface_container_lowest` color and a `shadow-sm`. On hover, they transition to `shadow-md` with a 1.05x scale.
- **Input Fields:** Soft backgrounds (`surface_container_low`) with a focus ring in the primary color. Avoid harsh black outlines.
- **The Map Marker:** Utilize a "pulse" animation (2s duration) for active locations to draw the user's eye through motion rather than static size.

### 6. Do's and Don'ts
- **Do:** Use intentional asymmetry. Let images overlap containers or extend past the standard grid.
- **Do:** Use grayscale filters for secondary imagery, transitioning to full color only on user interaction.
- **Don't:** Use pure black (#000) for text. Use `on_surface` (#221510) for a softer, more natural contrast.
- **Don't:** Over-round small components. While buttons are pill-shaped, cards and input fields should remain slightly sharper (`rounded-lg` or 8px-12px) to maintain an architectural feel.
- **Do:** Ensure all meaningful icons use the `Material Symbols Outlined` set to match the thin-stroke aesthetic of the typography.