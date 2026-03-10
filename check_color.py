import sys
try:
    from PIL import Image
    from collections import Counter
    img = Image.open(r"C:\Users\vallu\OneDrive\Desktop\NRCM-PJ\4-1-pj\landing_redesign_mockup_1773019830694.png")
    img = img.convert("RGB")
    print("Top left color:", "%02x%02x%02x" % img.getpixel((0,0)))
    
    width, height = img.size
    samples = []
    for x in range(0, width, 10):
        for y in range(0, height, 10):
            samples.append(img.getpixel((x,y)))
            
    print("Most common samples:")
    for color, count in Counter(samples).most_common(5):
        print("%02x%02x%02x" % color, count)
except ImportError:
    print("No PIL")
except Exception as e:
    print("Error:", e)
