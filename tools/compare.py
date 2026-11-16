"""Put a reference and a build screenshot side by side, cut into bands, so differences are easy to spot.

    python3 tools/compare.py <reference.png> <build.png> <out-prefix> [--band=1500]

Writes <out-prefix>-1.png, -2.png, ... (reference on the left, build on the right).
Read every band, list the differences (layout, spacing, size, font, colour, copy, order), fix, repeat.
"""
import sys
from PIL import Image

ref_path, build_path, prefix = sys.argv[1:4]
band = next((int(a.split("=")[1]) for a in sys.argv[4:] if a.startswith("--band=")), 1500)
ref, build = Image.open(ref_path).convert("RGB"), Image.open(build_path).convert("RGB")
height, gap = max(ref.height, build.height), 40
for i, top in enumerate(range(0, height, band), start=1):
    sheet = Image.new("RGB", (ref.width + build.width + gap, band), "white")
    sheet.paste(ref.crop((0, top, ref.width, top + band)), (0, 0))
    sheet.paste(build.crop((0, top, build.width, top + band)), (ref.width + gap, 0))
    sheet.save(f"{prefix}-{i}.png")
    print(f"{prefix}-{i}.png")
print(f"reference {ref.size}, build {build.size}")
