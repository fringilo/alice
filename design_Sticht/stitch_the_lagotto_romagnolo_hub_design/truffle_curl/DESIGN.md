---
name: Truffle & Curl
colors:
  surface: '#faf9f8'
  surface-dim: '#dadad9'
  surface-bright: '#faf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f2'
  surface-container: '#eeeeed'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e1'
  on-surface: '#1a1c1c'
  on-surface-variant: '#504441'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f0f0'
  outline: '#827470'
  outline-variant: '#d4c3be'
  surface-tint: '#77574d'
  primary: '#442a22'
  on-primary: '#ffffff'
  primary-container: '#5d4037'
  on-primary-container: '#d4ada1'
  inverse-primary: '#e7bdb1'
  secondary: '#655d5a'
  on-secondary: '#ffffff'
  secondary-container: '#ece0dc'
  on-secondary-container: '#6b6360'
  tertiary: '#432b22'
  on-tertiary: '#ffffff'
  tertiary-container: '#5b4137'
  on-tertiary-container: '#d2aea1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#e7bdb1'
  on-primary-fixed: '#2c160e'
  on-primary-fixed-variant: '#5d4037'
  secondary-fixed: '#ece0dc'
  secondary-fixed-dim: '#cfc4c0'
  on-secondary-fixed: '#201a18'
  on-secondary-fixed-variant: '#4c4542'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#e4beb2'
  on-tertiary-fixed: '#2b160f'
  on-tertiary-fixed-variant: '#5b4137'
  background: '#faf9f8'
  on-background: '#1a1c1c'
  surface-variant: '#e3e2e1'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

The brand personality is organic, warm, and professional, reflecting the intelligent yet affectionate nature of the Lagotto Romagnolo. It targets prospective owners, breeders, and enthusiasts who value authenticity and high-quality care. 

The design style is **Modern Minimalist with Organic influences**. It leverages heavy whitespace to create a sense of "fresh air," balanced by rich, earthy textures. The UI should evoke an emotional response of trust and comfort, moving away from sterile corporate looks toward a "boutique-heritage" feel. Elements are soft and approachable, avoiding harsh angles to mimic the breed's curly, soft coat.

## Colors

The palette is directly inspired by the Lagotto's natural coat variations.
- **Primary (Truffle):** A deep, warm chocolate brown used for primary actions, headings, and core branding. It provides the "grounding" force of the design.
- **Secondary (Sandy Beige):** A soft, warm neutral used for secondary buttons, subtle backgrounds, and accents.
- **Tertiary (Warm Bark):** A mid-tone brown for supporting elements, hover states, and iconography.
- **Neutral (Crisp Linen):** A near-white off-white used for the global background to maintain warmth without the starkness of pure hex #FFFFFF.
- **Success/Error:** Use muted sage greens and soft terracottas rather than bright neon signals to maintain the organic aesthetic.

## Typography

This design system uses **Plus Jakarta Sans** as the primary typeface for its soft, rounded terminals and contemporary clarity, which perfectly aligns with the "friendly yet professional" brief. **Work Sans** is introduced for small labels and utility text to provide a slightly more grounded, stable feel for functional data.

Headings should use tighter letter-spacing and deep primary brown colors. Body text should maintain generous line-height (1.6) to ensure high readability and a "breathable" feel. For mobile, display sizes scale down aggressively to prevent awkward line breaks while maintaining bold visual hierarchy.

## Layout & Spacing

The layout follows a **Fixed-Width Grid** model for desktop to maintain a curated, editorial feel, transitioning to a fluid model for mobile.

- **Desktop (1200px+):** 12-column grid, 24px gutters, 80px top/bottom section margins.
- **Tablet (768px - 1199px):** 8-column grid, 24px gutters, 48px side margins.
- **Mobile (below 768px):** 4-column grid, 16px gutters, 20px side margins.

Spacing follows an 8px base unit. Use generous "xl" spacing between major sections to emphasize the minimalist aesthetic. Components within cards should use "md" (24px) padding to feel spacious and premium.

## Elevation & Depth

This design system eschews heavy shadows in favor of **Tonal Layering** and **Soft Ambient Occlusion**.

1. **Surface Layers:** Use subtle shifts in background color (e.g., a "Sandy Beige" container on a "Crisp Linen" background) to define hierarchy.
2. **Shadows:** When depth is required (e.g., for elevated cards or floating buttons), use very soft, diffused shadows: `0px 4px 20px rgba(93, 64, 55, 0.08)`. The shadow color should always be a low-opacity version of the primary brown, never pure black.
3. **Outlines:** Use 1px solid borders in the Secondary color for low-level containment (e.g., input fields, inactive tabs).

## Shapes

The shape language is defined by **Rounded (0.5rem base)** corners. This level of roundedness strikes the balance between modern professional and organic warmth.

- **Standard Elements (Buttons, Inputs):** 0.5rem (8px).
- **Large Containers (Cards, Modals):** 1rem (16px).
- **Feature Elements (Hero Images, Large Buttons):** 1.5rem (24px).
- **Iconography:** Use a rounded icon set (e.g., Feather or Lucide with a 2px stroke) to match the UI's softness.

## Components

- **Buttons:** Primary buttons use a solid Truffle Brown background with white text. Secondary buttons use a Sandy Beige background with Truffle Brown text. All buttons have a minimum height of 48px and generous horizontal padding (24px).
- **Cards:** Cards should be borderless with a very subtle Sandy Beige background or a soft ambient shadow. Padding is 24px or 32px to ensure content doesn't feel cramped.
- **Input Fields:** Use a subtle Sandy Beige fill with a 1px border. On focus, the border thickens slightly and transitions to Truffle Brown.
- **Chips/Badges:** Used for dog traits (e.g., "Hypoallergenic," "Energetic"). These should be Pill-shaped with a light Tertiary tint and semi-bold Label-sm typography.
- **Lists:** Bullet points are replaced with custom Truffle-colored icons (e.g., small paw prints or simple soft circles) to enhance the brand theme.
- **Image Treatment:** Photos should always have rounded corners (16px) and, where possible, use a warm, natural filter to align with the earthy palette.