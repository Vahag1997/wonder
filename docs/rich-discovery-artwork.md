# Rich story discovery — artwork provenance

Generated with the built-in image-generation tool, 2026-09-16. These are original promotional illustrations, not personalized customer results or production-ready book templates. No customer photographs were supplied.

## Homepage artwork

Saved as `public/images/wonder-world.webp` (1536 × 1024, about 301 KiB). Original PNG retained in the image tool output directory.

Prompt:

Use case: illustration-story. Asset type: original promotional hero artwork for Wonder, a Russian-first personalized children's storybook website with lavender and warm ivory interface. Create a premium richly detailed 3D storybook illustration, wide landscape 3:2 composition. An oversized open storybook lies in foreground; a tiny enchanting woodland world grows out of its pages, with soft moss, miniature storybook trees, floating warm firefly lights and a winding golden path. A happy five-year-old boy with short brown hair and a happy five-year-old girl with dark curly hair stand together as little explorers in that world, wearing tasteful sage and ochre everyday adventure clothing. Friendly, natural child expressions, anatomically correct faces and hands, two ears per child, gentle expressive eyes, no fear. Cohesive luxurious sculpted-and-painted children's book aesthetic, tactile paper edges, warm cinematic lighting, subtle lavender dusk environment, dreamy depth, professional art direction. Both children and open book centered and fully visible, ample breathing room around them for website cropping. No text, no letters, no logos, no watermark, no UI, no resemblance to existing branded characters. This is clearly whimsical promotional artwork, not a photo or an actual personalized book page.

## Girls’ collection artwork

Saved as `public/images/wonder-girl-adventure.webp` (1200 × 800). Original PNG retained in the image tool output directory.

Prompt:

Use case: illustration-story. Asset type: original wide promotional collection banner for Wonder children's storybook website. Premium warm cinematic 3D storybook illustration with a tactile painted quality: a joyful five-year-old girl with dark curly hair in a mustard yellow pinafore and cream knitted cardigan exploring a magical woodland garden with a small friendly rabbit. She holds a softly glowing lantern. Delight, kindness and curiosity in her face, natural child proportions, correct hands and ears. Rich soft moss and tiny flowers, lavender dusk, golden fireflies, distant miniature treehouse, subtle depth of field. The girl is the only human and is positioned in the right half, waist-up visible with breathing room around her head; left half has softer less-detailed scenery for an overlay title. Landscape 3:2 composition. Charming and emotionally warm, cohesive high-end sculpted-and-painted storybook aesthetic, not a photograph. No text, no letters, no logos, no watermarks, no UI, no recognizable licensed character. This is a promotional concept, not an actual page or book offered for sale.

## Motion and availability

- Cinematic image pan and floating light animation are CSS, not generated video. A pause control and offscreen pause prevent uncontrolled continuous motion; reduced-motion settings disable animation.
- The interactive book viewer uses two actual source spreads, with manual controls and CSS page/open transitions. It is explicitly labeled as a source sample.
- Gender is selected by the parent, never inferred from a photo or name. Catalog editions have explicit `heroGenders`; the purchase client sends `childGender` only for supported editions. The future server must independently validate this against its own approved template manifest; the client is not a security boundary.
- Current supplied books have boy protagonists. The girls’ collection is an honest coming-soon state, not an invented purchasable book. Adding a approved girl template and catalog metadata is required before girl generation can be enabled.
- Existing live generation/payment routes remain disabled. This revision does not deploy, send photos, or start a book generation job.

## Verification

- ESLint and 23 unit tests passed, including explicit gender filters, combined search/theme filters, unsupported-edition rejection before a network call, and gender in the multipart request contract.
- Production build passed. Homepage first-load JavaScript is 116 kB (previous redesign: 111 kB); generated WebP artwork totals about 442 KiB before Next image optimization. No video library, third-party media embed or additional package was installed.
- Browser checks: homepage, boy catalog, girl catalog and personalization at 320/768/1024/1440 widths had one H1, no horizontal overflow and no broken loaded images detected.
- Interactions checked: boy/girl filters, combined friendship filter, girl-edition block before photo, boy name/age progression, mobile navigation and Escape, animation pause, book opening, both source spreads, last-page disabled state.
- HTTP language checks passed for default Russian, invalid cookie fallback, RU and EN across 12 routes and localized 404s. All 21 closed purchase/API checks passed; no upload, generation or checkout was enabled.
- Visual checks covered desktop and mobile homepage, girls’ collection and the interactive reader. No full accessibility audit or live customer order test was performed; this is not a claim that the production service is complete.
