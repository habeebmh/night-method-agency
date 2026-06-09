from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[3]
KIT = ROOT / "press-kit" / "habeeb-signing"
OUT = KIT / "social"

COLORS = {
    "black": (10, 9, 8),
    "cream": (245, 241, 232),
    "cream_dim": (218, 211, 197),
    "lime": (199, 255, 92),
    "red": (217, 75, 43),
    "amber": (242, 170, 58),
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
    sw, sh = img.size
    dw, dh = size
    scale = max(dw / sw, dh / sh)
    resized = img.resize((round(sw * scale), round(sh * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - dw) // 2
    top = (resized.height - dh) // 2
    return resized.crop((left, top, left + dw, top + dh))


def add_overlay(img, alpha=174):
    return Image.alpha_composite(img.convert("RGBA"), Image.new("RGBA", img.size, COLORS["black"] + (alpha,)))


def text_size(draw, text, fnt):
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def wrap_text(draw, text, fnt, max_width):
    lines = []
    for raw in text.split("\n"):
        words = raw.split()
        current = ""
        for word in words:
            test = word if not current else f"{current} {word}"
            if text_size(draw, test, fnt)[0] <= max_width:
                current = test
            else:
                if current:
                    lines.append(current)
                current = word
        if current:
            lines.append(current)
    return lines


def draw_wrapped(draw, xy, text, fnt, fill, max_width, line_gap=12):
    x, y = xy
    for line in wrap_text(draw, text, fnt, max_width):
        draw.text((x, y), line, font=fnt, fill=fill)
        y += text_size(draw, line, fnt)[1] + line_gap
    return y


def fit_title(draw, text, max_width, start=120, minimum=64):
    size = start
    while size >= minimum:
        fnt = font("black", size)
        if all(text_size(draw, line, fnt)[0] <= max_width for line in wrap_text(draw, text, fnt, max_width)):
            return fnt
        size -= 4
    return font("black", minimum)


def add_grid(draw, size):
    w, h = size
    for x in range(0, w, 72):
        draw.line((x, 0, x, h), fill=(245, 241, 232, 16), width=1)
    for y in range(0, h, 72):
        draw.line((0, y, w, y), fill=(245, 241, 232, 16), width=1)


def draw_mark(draw, x, y, scale=1):
    r = 25 * scale
    draw.ellipse((x, y, x + r * 2, y + r * 2), fill=COLORS["lime"])
    draw.rectangle((x + 23 * scale, y + 15 * scale, x + 28 * scale, y + 38 * scale), fill=COLORS["black"])
    draw.arc((x + 11 * scale, y + 7 * scale, x + 42 * scale, y + 48 * scale), start=288, end=72, fill=COLORS["black"], width=round(4 * scale))
    draw.arc((x + 3 * scale, y - 2 * scale, x + 51 * scale, y + 57 * scale), start=296, end=64, fill=COLORS["black"], width=round(4 * scale))


def draw_brand(draw, w, h, slide_no=None):
    draw_mark(draw, 62, 62, 1)
    draw.text((130, 72), "NIGHT METHOD", font=font("black", 28), fill=COLORS["cream"])
    draw.text((130, 105), "AGENCY", font=font("bold", 17), fill=COLORS["cream_dim"])
    if slide_no:
        draw.text((w - 142, 76), slide_no, font=font("bold", 20), fill=COLORS["cream_dim"])


def draw_footer(draw, w, h):
    draw.line((62, h - 116, w - 62, h - 116), fill=(245, 241, 232, 56), width=1)
    draw.text((62, h - 82), "@HABEEEEEEEEEEEEEEEB", font=font("bold", 21), fill=COLORS["cream"])
    draw.text((w - 400, h - 82), "BOOKINGS@NIGHTMETHODAGENCY.COM", font=font("bold", 21), fill=COLORS["cream_dim"])


def make_slide(filename, bg, eyebrow, title, body, meta, slide_no, accent="lime"):
    size = (1080, 1350)
    img = cover_image(ROOT / bg, size).filter(ImageFilter.GaussianBlur(radius=0.25))
    canvas = add_overlay(img, 172)
    draw = ImageDraw.Draw(canvas, "RGBA")
    add_grid(draw, size)
    draw_brand(draw, *size, slide_no=slide_no)
    accent_color = COLORS[accent]
    draw.rectangle((62, 258, 70, 738), fill=accent_color)
    draw.text((92, 264), eyebrow.upper(), font=font("bold", 24), fill=accent_color)
    title_font = fit_title(draw, title.upper(), 870)
    y = draw_wrapped(draw, (92, 332), title.upper(), title_font, COLORS["cream"], 870, line_gap=12)
    y += 24
    y = draw_wrapped(draw, (92, y), body, font("regular", 38), COLORS["cream_dim"], 840, line_gap=15)
    x = 92
    y = min(y + 54, 1098)
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
    draw.rectangle((62, 404, 70, 1096), fill=accent_color)
    title_font = fit_title(draw, title.upper(), 870, start=126, minimum=72)
    y = draw_wrapped(draw, (92, 418), title.upper(), title_font, COLORS["cream"], 870, line_gap=16)
    draw_wrapped(draw, (92, y + 42), body, font("regular", 42), COLORS["cream_dim"], 835, line_gap=18)
    draw_footer(draw, *size)
    canvas.convert("RGB").save(OUT / "story" / filename, quality=96)


def main():
    (OUT / "images").mkdir(parents=True, exist_ok=True)
    (OUT / "story").mkdir(parents=True, exist_ok=True)

    slides = [
        (
            "01-signing.png",
            "press-kit/habeeb-signing/source/generated-habeeb-signing-bg.png",
            "Signing announcement",
            "Habeeb signs to Night Method.",
            "Night Method Agency welcomes the Dallas-based DJ and producer to its selective management roster.",
            ["Dallas", "DJ / Producer", "Night Method"],
            "01 / 05",
            "lime",
        ),
        (
            "02-dallas.png",
            "public/images/stage.webp",
            "From Dallas",
            "Club-built. Room-first.",
            "Habeeb's public catalog moves through house, afro-house, remix culture, mashups, and DJ tools.",
            ["House", "Afro house", "Remix"],
            "02 / 05",
            "amber",
        ),
        (
            "03-sound.png",
            "public/images/street-portrait.webp",
            "Sound",
            "Edits with a pulse.",
            "Functional enough for the booth, distinctive enough to travel beyond it.",
            ["Mashups", "DJ tools", "Club edits"],
            "03 / 05",
            "lime",
        ),
        (
            "04-next-run.png",
            "public/images/duo.webp",
            "The next run",
            "Sharper rollouts. Better rooms.",
            "Night Method will support management, live strategy, release planning, partnerships, and creative direction.",
            ["Management", "Live strategy", "Releases"],
            "04 / 05",
            "red",
        ),
        (
            "05-inquiries.png",
            "public/images/booth.webp",
            "Inquiries",
            "Press, booking, partnerships, collaborations.",
            "Habeeb is now represented by Night Method Agency.",
            ["Press", "Booking", "Partnerships"],
            "05 / 05",
            "lime",
        ),
    ]
    for slide in slides:
        make_slide(*slide)

    stories = [
        (
            "story-01-signing.png",
            "press-kit/habeeb-signing/source/generated-habeeb-signing-bg.png",
            "Habeeb signs to Night Method Agency.",
            "Dallas-based. Club-built. The next run starts here.",
            "lime",
        ),
        (
            "story-02-sound.png",
            "public/images/stage.webp",
            "House. Afro-house. Remixes. Mashups. DJ tools.",
            "Room-first energy, now represented by Night Method.",
            "amber",
        ),
        (
            "story-03-contact.png",
            "public/images/booth.webp",
            "Press, booking, partnerships, collaborations.",
            "bookings@nightmethodagency.com",
            "red",
        ),
    ]
    for story in stories:
        make_story(*story)


if __name__ == "__main__":
    main()
