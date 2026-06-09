# Night Method Press Kit

## Contents

- `press-release.md`: launch press release copy.
- `instagram-copy.md`: caption, story copy, and hashtag set.
- `social/images/`: five 1080x1350 carousel images.
- `social/story/`: three 1080x1920 story images.
- `social/contact-sheet.png`: quick visual preview of the exported set.
- `source/render_instagram_set.py`: deterministic renderer for the social images.
- `source/generated-night-texture.png`: AI-generated no-text nightlife texture used as the launch background.

## Carousel Order

1. `social/images/01-launch.png`
2. `social/images/02-positioning.png`
3. `social/images/03-services.png`
4. `social/images/04-roster.png`
5. `social/images/05-inquiries.png`

## Story Order

1. `social/story/story-01-launch.png`
2. `social/story/story-02-services.png`
3. `social/story/story-03-contact.png`

## Generated Background Prompt

Mode: built-in image generation.

Prompt summary: a moody, premium nightlife press-announcement background with dark club atmosphere, subtle lime-green signal light, warm off-white highlights, editorial music-industry mood, vertical 4:5 negative space, and no readable text, logos, watermarks, or identifiable faces.

## Regenerate

```bash
python3 press-kit/source/render_instagram_set.py
```
