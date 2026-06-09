from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "press-kit" / "social"

COLORS = {
    "black": (10, 9, 8),
    "ink": (17, 19, 16),
    "cream": (245, 241, 232),
    "cream_dim": (218, 211, 197),
    "lime": (199, 255, 92),
    "red": (217, 75, 43),
}

FONTS = {
    "black": "/System/Library/Fonts/Supplemental/Arial Black.ttf",
    "bold": "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "regular": "/System/Library/Fonts/Supplemental/Arial.ttf",
}


def font(name, size):
    return ImageFont.truetype(FONTS[name], size=size)


def cover_image(path, size):
    img = Image.open(path).convert("RGB")
    src_w, src_h = img.size
    dst_w, dst_h = size
    scale = max(dst_w / src_w, dst_h / src_h)
    new_size = (round(src_w * scale), round(src_h * scale))
    img = img.resize(new_size, Image.Resampling.LANCZOS)
    left = (new_size[0] - dst_w) // 2
    top = (new_size[1] - dst_h) // 2
    return img.crop((left, top, left + dst_w, top + dst_h))


def add_overlay(img, alpha=170):
    shade = Image.new("RGBA", img.size, COLORS["black"] + (alpha,))
    return Image.alpha_composite(img.convert("RGBA"), shade)


def add_grid(draw, size):
    w, h = size
    grid = (245, 241, 232, 18)
    for x in range(0, w, 72):
        draw.line((x, 0, x, h), fill=grid, width=1)
    for y in range(0, h, 72):
        draw.line((0, y, w, y), fill=grid, width=1)


def text_size(draw, text, fnt):
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def wrap_text(draw, text, fnt, max_width):
    lines = []
    for raw in text.split("\n"):
        words = raw.split()
        line = ""
        for word in words:
            test = word if not line else f"{line} {word}"
            if text_size(draw, test, fnt)[0] <= max_width:
                line = test
            else:
                if line:
                    lines.append(line)
                line = word
        if line:
            lines.append(line)
    return lines


def draw_wrapped(draw, xy, text, fnt, fill, max_width, line_gap=12):
    x, y = xy
    for line in wrap_text(draw, text, fnt, max_width):
        draw.text((x, y), line, font=fnt, fill=fill)
        y += text_size(draw, line, fnt)[1] + line_gap
    return y


def fit_title(draw, text, max_width, start=118, minimum=68):
    size = start
    while size >= minimum:
        fnt = font("black", size)
        if all(text_size(draw, line, fnt)[0] <= max_width for line in wrap_text(draw, text, fnt, max_width)):
            return fnt
        size -= 4
    return font("black", minimum)


def draw_brand(draw, w, h, slide_no=None):
    draw.ellipse((62, 62, 112, 112), fill=COLORS["lime"])
    draw.rectangle((85, 76, 90, 99), fill=COLORS["black"])
    draw.arc((73, 68, 104, 109), start=288, end=72, fill=COLORS["black"], width=4)
    draw.arc((65, 59, 113, 118), start=296, end=64, fill=COLORS["black"], width=4)
    draw.text((130, 72), "NIGHT METHOD", font=font("black", 28), fill=COLORS["cream"])
    draw.text((130, 105), "AGENCY", font=font("bold", 17), fill=COLORS["cream_dim"])
    if slide_no:
        draw.text((w - 142, 76), slide_no, font=font("bold", 20), fill=COLORS["cream_dim"])


def draw_footer(draw, w, h):
    draw.line((62, h - 116, w - 62, h - 116), fill=(245, 241, 232, 56), width=1)
    draw.text((62, h - 82), "BOOKINGS@NIGHTMETHODAGENCY.COM", font=font("bold", 21), fill=COLORS["cream"])
    draw.text((w - 330, h - 82), "NIGHTMETHODAGENCY.COM", font=font("bold", 21), fill=COLORS["cream_dim"])


def make_slide(filename, bg, eyebrow, title, body, meta, slide_no, accent="lime"):
    size = (1080, 1350)
    img = cover_image(ROOT / bg, size).filter(ImageFilter.GaussianBlur(radius=0.2))
    canvas = add_overlay(img, 176)
    draw = ImageDraw.Draw(canvas, "RGBA")
    add_grid(draw, size)
    draw_brand(draw, *size, slide_no=slide_no)
    accent_color = COLORS[accent]
    draw.rectangle((62, 265, 70, 730), fill=accent_color)
    draw.text((92, 270), eyebrow.upper(), font=font("bold", 24), fill=accent_color)
    title_font = fit_title(draw, title.upper(), 870)
    y = draw_wrapped(draw, (92, 332), title.upper(), title_font, COLORS["cream"], 870, line_gap=12)
    y += 22
    y = draw_wrapped(draw, (92, y), body, font("regular", 38), COLORS["cream_dim"], 830, line_gap=15)
    if meta:
        x = 92
        y = min(y + 54, 1100)
        for item in meta:
            tw, _ = text_size(draw, item.upper(), font("bold", 18))
            draw.rectangle((x, y, x + tw + 42, y + 52), outline=(245, 241, 232, 72), width=2)
            draw.text((x + 21, y + 17), item.upper(), font=font("bold", 18), fill=COLORS["cream_dim"])
            x += tw + 60
    draw_footer(draw, *size)
    canvas.convert("RGB").save(OUT / "images" / filename, quality=96)


def make_story(filename, bg, title, body, accent="lime"):
    size = (1080, 1920)
    img = cover_image(ROOT / bg, size)
    canvas = add_overlay(img, 188)
    draw = ImageDraw.Draw(canvas, "RGBA")
    add_grid(draw, size)
    draw_brand(draw, *size)
    accent_color = COLORS[accent]
    draw.rectangle((62, 396, 70, 1060), fill=accent_color)
    title_font = fit_title(draw, title.upper(), 870, start=126, minimum=72)
    y = draw_wrapped(draw, (92, 410), title.upper(), title_font, COLORS["cream"], 870, line_gap=16)
    draw_wrapped(draw, (92, y + 40), body, font("regular", 42), COLORS["cream_dim"], 820, line_gap=18)
    draw_footer(draw, *size)
    canvas.convert("RGB").save(OUT / "story" / filename, quality=96)


def main():
    (OUT / "images").mkdir(parents=True, exist_ok=True)
    (OUT / "story").mkdir(parents=True, exist_ok=True)

    slides = [
        (
            "01-launch.png",
            "press-kit/source/generated-night-texture.png",
            "For immediate release",
            "Night Method Agency is live.",
            "A discreet management and strategy office for select artists, producers, and culture-facing projects.",
            ["Management", "Strategy", "Culture"],
            "01 / 05",
            "lime",
        ),
        (
            "02-positioning.png",
            "public/images/stage.webp",
            "Artist management",
            "Build the run, protect the signal.",
            "For projects moving between records, rooms, campaigns, partnerships, and long-format career work.",
            ["Release plans", "Shows", "Partnerships"],
            "02 / 05",
            "lime",
        ),
        (
            "03-services.png",
            "public/images/street-portrait.webp",
            "Services",
            "Quiet infrastructure for visible work.",
            "Day-to-day management, artist development, campaign strategy, live routing, and special projects.",
            ["A&R", "Creative direction", "Digital PR"],
            "03 / 05",
            "red",
        ),
        (
            "04-roster.png",
            "public/images/duo.webp",
            "Roster",
            "Select artists. Limited disclosure.",
            "Night Method works privately with developing and established projects. Public credits are shared case by case.",
            ["Private bookings", "Label-side projects", "Brand rooms"],
            "04 / 05",
            "lime",
        ),
        (
            "05-inquiries.png",
            "public/images/booth.webp",
            "Inquiries",
            "Send the music, context, and what needs managing.",
            "Include links, timeline, city, and the practical ask. We reply when there is a fit.",
            ["Links", "Timeline", "City"],
            "05 / 05",
            "red",
        ),
    ]
    for slide in slides:
        make_slide(*slide)

    stories = [
        (
            "story-01-launch.png",
            "press-kit/source/generated-night-texture.png",
            "Night Method Agency is live.",
            "Artist management after dark.",
            "lime",
        ),
        (
            "story-02-services.png",
            "public/images/stage.webp",
            "Management. Development. Campaigns. Live strategy.",
            "Built for the work between the room and the record.",
            "red",
        ),
        (
            "story-03-contact.png",
            "public/images/street-portrait.webp",
            "Send the music, context, and what needs managing.",
            "bookings@nightmethodagency.com",
            "lime",
        ),
    ]
    for story in stories:
        make_story(*story)


if __name__ == "__main__":
    main()
