# MagicBook client branding

The client's original JPEG is preserved at `public/images/brand/magicbook-original.jpeg`. Its WebP delivery copy is unchanged artwork. The header uses CSS windows to arrange the original illustration and lettering horizontally; the footer shows the full supplied design. No lettering was recreated by AI.

The simplified favicon was created using the built-in image-generation tool, with the supplied logo as reference. Saved asset: `public/images/brand/magicbook-symbol.png`. Delivery exports: `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/favicon.ico` (16, 32, 48 pixels). Re-export using `node scripts/prepare-brand-icons.mjs`.

## Final generation prompt

Use case: logo-brand. Asset type: browser favicon for MagicBook children's personalized storybooks. Image 1 is the client's brand reference. Derive a simplified icon from its purple open magic book, fairy-tale castle and crescent moon. Keep the reference's purple/lavender palette and warm inviting storybook feeling, but make a bold, extremely simple flat emblem readable at 16 and 32 pixels: a thick open-book silhouette at the bottom and one compact three-tower castle rising above, with a small crescent only if clear. Square composition, symbol fills about 88% of canvas. Solid clean white background, dark saturated purple shapes, very minimal lavender accents. No children, bunny, words, letters, tagline, tiny stars, fine detail, glow, shadows, gradients, mockups or border. One icon only, no presentation sheet.

The tool returned a transparent background; its alpha is preserved for browser icons. The Apple home-screen export is flattened onto white. Next.js file-based metadata supplies the icons, avoiding competing legacy icon declarations.

## Verification

- ESLint, all 23 existing unit tests, and production build passed.
- Chrome visual inspection: desktop header at 1440px and compact header/footer at 320px; logo and navigation remain visible without overlap.
- HTTP checks: browser/Apple PNG endpoints return 200 with 192px/180px dimensions; ICO contains 16px, 32px and 48px entries. Server-rendered metadata no longer references the old SVG.
- This logo update does not fix the separately reported mobile book-preview clipping and small-text issues. It is local only, not pushed to GitHub.
