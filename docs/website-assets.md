# Asset provenance — 13 September 2026

The imagegen skill was used for two original fictional marketing assets via built-in image_gen, not Gemini or Vast. The PDF skill was used to inspect/render actual supplied book samples rather than inventing customer results. The Sites building guidance informed the visual implementation while the existing Next.js project and local-preview deployment boundary were preserved.

## Site assets

- `public/images/storybook-forest.webp`: original fictional illustrated scene; 261,666 bytes.
- `public/images/reading-together.webp`: original fictional family reading scene; 219,504 bytes.
- These are marketing visuals, not real customers, testimonials, or proof of personalized generation.
- Original PNGs and prompts: `/Users/macrpo/ChildBook/output/imagegen/wonder-redesign-20260913/`. Main agent inspected both original images before inclusion.

## Book sample assets

Local source PDFs were rendered with Poppler and converted to WebP with Sharp. No source PDF was changed. `scripts/prepare-book-assets.mjs` renders source pages 1, 3 and 5 at up to 1600px:

- Amir: `/Users/macrpo/Desktop/testbook/Книга Амир_новая обложка 20х20.pdf`.
- Fluffy: `/Users/macrpo/Desktop/testbook/-Maksim-and-Fluffy's-Adventure.pdf`.
- ABC: `/Users/macrpo/Desktop/testbook/The-ABC-Journey-with-Sasha--.pdf`.

The cover presentation crops the Amir front cover in CSS; the sample viewer still shows the full source spread. The original hero is shown and labelled; these files are not generated personalization results. Fluffy and ABC retain third-party Wonderwraps branding and are reference-only. All source rights must be approved before public/commercial use.

## Exact image-generation prompts

# Website illustration originals

Generated with built-in image_gen, exactly one request per asset. No retries or variants. Both images are 1536 × 1024 PNGs. Originals remain in the built-in generated image directory.

## Storybook forest

File: storybook-forest-original.png

Inspected: child, fluffy dog and glowing book are centered with rich forest edges and no typography or watermark. The generated scene also includes a small owl, squirrel, moon and distant castle; the child is lying down, with the lower body visible behind the book.

Exact prompt:

```text
Use case: illustration-story
Asset type: original landscape homepage illustration for a sophisticated family publishing website.
Primary request: A small fictional child with short dark hair and a warm, gentle expression and a friendly fluffy dog discover a luminous open storybook in a lush forest.
Scene/backdrop: An immersive forest at blue and teal twilight with richly layered green foreground foliage and tiny fireflies.
Style/medium: Charming children's storybook editorial illustration; richly textured hand-painted gouache with polished 3D depth. Not photorealistic.
Composition/framing: Landscape 3:2 composition, approximately 1536 x 1024. Main child and dog centered, whole figures visible, roomy forest edges.
Lighting/mood: Honey-gold light from the book illuminates the two characters; magical, tender, curious and inviting.
Constraints: Exactly one child and one dog. Original fictional characters, no real child reference. No typography, no legible writing, no logo, no watermark. This is marketing illustration, not a customer book sample.
```

## Family reading

File: family-reading-original.png

Inspected: warm candid reading scene, natural expressions, visible hands and illustrated book, no legible book text or watermark. The front-facing book surfaces are its outer illustrated covers, with the pair reading the interior.

Exact prompt:

```text
Use case: photorealistic-natural
Asset type: landscape reading-section marketing photograph for a sophisticated family publishing website.
Primary request: A candid mother of color with her fictional young child reading an illustrated open book together on a sofa by a sunlit window.
Scene/backdrop: An understated, comfortable home with a softly textured sofa by a window.
Subject: One mother and her young child, with joyful but natural faces, sharing a warm everyday reading moment and looking at the open book.
Style/medium: Photorealistic warm editorial lifestyle photography, natural skin texture, realistic fabric and paper, candid and unforced.
Composition/framing: Landscape 3:2, approximately 1536 x 1024, medium shot showing both faces, the open book and their hands clearly. Believable hands naturally supporting and pointing at the illustrated book.
Lighting/mood: Soft warm honey sunlight, inviting and affectionate, natural color balance.
Constraints: Original fictional people, no real private child photo references. The open book contains colorful illustrations but no legible text and no third-party logos. No text overlay, no watermark. This is a marketing lifestyle image, not evidence of a generated customer book.
```
