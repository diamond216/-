"""Tile option screenshots into one picture for the owner to choose from.

    python3 tools/options-sheet.py <out.png> <img1> <img2> [<img3> ...] [--cols=3] [--width=1000]
"""
import sys
from PIL import Image

args = [a for a in sys.argv[1:] if not a.startswith("--")]
opts = {a.split("=")[0][2:]: int(a.split("=")[1]) for a in sys.argv[1:] if a.startswith("--")}
out, images = args[0], [Image.open(p).convert("RGB") for p in args[1:]]
cols, width = opts.get("cols", 3), opts.get("width", 1000)
images = [im.resize((width, int(im.height * width / im.width))) for im in images]
row_h = max(im.height for im in images)
rows = (len(images) + cols - 1) // cols
sheet = Image.new("RGB", (cols * width + (cols - 1) * 30, rows * row_h + (rows - 1) * 30), "white")
for i, im in enumerate(images):
    sheet.paste(im, ((i % cols) * (width + 30), (i // cols) * (row_h + 30)))
sheet.save(out)
print(out, sheet.size)
