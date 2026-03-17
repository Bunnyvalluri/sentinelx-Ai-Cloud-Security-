"""
check_color.py — Scans screenshots for dominant colors in light mode.
Usage: python check_color.py [image_path]
"""
import sys
import os

def check_colors(path):
    try:
        from PIL import Image
        from collections import Counter

        if not os.path.exists(path):
            print(f"Error: File not found: {path}")
            return

        img = Image.open(path)
        img = img.convert("RGB")
        width, height = img.size
        print(f"Image: {path}  ({width}x{height})")
        print("Top-left color: #%02x%02x%02x" % img.getpixel((0, 0)))

        # Sample every 10px
        samples = []
        for x in range(0, width, 10):
            for y in range(0, height, 10):
                samples.append(img.getpixel((x, y)))

        print("\nTop 10 most common colors:")
        for color, count in Counter(samples).most_common(10):
            print(f"  #{color[0]:02x}{color[1]:02x}{color[2]:02x}  (count: {count})")

    except ImportError:
        print("Pillow not installed. Run: pip install Pillow")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        check_colors(sys.argv[1])
    else:
        # Default: scan the most recent screenshot in the artifacts dir
        artifacts = r"C:\Users\vallu\.gemini\antigravity\brain"
        pngs = []
        for root, dirs, files in os.walk(artifacts):
            for f in files:
                if f.endswith(".png") and "light_mode" in f:
                    pngs.append(os.path.join(root, f))
        if pngs:
            latest = max(pngs, key=os.path.getmtime)
            print(f"Checking latest light-mode screenshot: {latest}")
            check_colors(latest)
        else:
            print("Usage: python check_color.py <image_path>")
