# Habeeb Signing Press Kit

## Contents

- `press-release.md`: signing announcement press release.
- `instagram-copy.md`: caption, short caption, story copy, and hashtags.
- `source-notes.md`: public source notes used for factual claims.
- `social/images/`: five 1080x1350 carousel images.
- `social/story/`: three 1080x1920 story images.
- `social/contact-sheet.png`: quick preview of the exported image set.
- `source/render_habeeb_signing_set.py`: deterministic renderer for the image set.
- `source/generated-habeeb-signing-bg.png`: AI-generated no-text signing background.

## Carousel Order

1. `social/images/01-signing.png`
2. `social/images/02-dallas.png`
3. `social/images/03-sound.png`
4. `social/images/04-next-run.png`
5. `social/images/05-inquiries.png`

## Story Order

1. `social/story/story-01-signing.png`
2. `social/story/story-02-sound.png`
3. `social/story/story-03-contact.png`

## Generated Background Prompt

Mode: built-in image generation.

Prompt summary: a premium no-text signing-announcement background for a DJ/producer, using dark nightclub booth atmosphere, kinetic crowd energy, warm amber and lime signal lighting, subtle green laser line, editorial club-photography realism, and negative space for typography.

## Regenerate

```bash
python3 press-kit/habeeb-signing/source/render_habeeb_signing_set.py
```
