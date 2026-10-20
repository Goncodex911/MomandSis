import os
from PIL import Image, ImageFilter
import numpy as np
import cv2

asset_dir = r"d:\CODE\Mon&Sis\asset"
out_dir = r"d:\CODE\Mon&Sis\asset\transparent"
os.makedirs(out_dir, exist_ok=True)

def clean_edges(alpha_mask, feather=2):
    # smooth the mask
    mask_im = Image.fromarray(alpha_mask, mode="L")
    if feather > 0:
        mask_im = mask_im.filter(ImageFilter.GaussianBlur(feather))
    return np.array(mask_im)

# 1. Blush Trio
def do_blush():
    p = os.path.join(asset_dir, "Blush Trio Valentine Wall Art _ Minimal Floral Bedroom Decor Printable.jfif")
    img = Image.open(p).convert("RGBA")
    arr = np.array(img)
    # Background is white > 245
    rgb = arr[:, :, :3]
    whiteness = np.min(rgb, axis=2) # 0 to 255
    # Pixels where min(R,G,B) > 245 are pure white
    # Anything darker has pigment
    alpha = np.zeros_like(whiteness, dtype=np.float32)
    # Ramp from 248 (alpha 0) down to 215 (alpha 255)
    alpha = np.clip((248.0 - whiteness) / 30.0 * 255.0, 0, 255)
    
    # Floodfill from corners to ensure outside regions are strictly 0
    bg_seed = (whiteness > 240).astype(np.uint8)
    h, w = whiteness.shape
    cv2_mask = np.zeros((h + 2, w + 2), np.uint8)
    # floodFill from all 4 corners
    for seed in [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1), (w//2, 0)]:
        cv2.floodFill(bg_seed, cv2_mask, seed, 2)
    is_outside = (bg_seed == 2)
    alpha[is_outside & (whiteness > 238)] = 0
    
    arr[:, :, 3] = np.clip(alpha, 0, 255).astype(np.uint8)
    Image.fromarray(arr).save(os.path.join(out_dir, "flower_blush_trans.png"))
    print("Blush done")

# 2. Peony
def do_peony():
    p = os.path.join(asset_dir, "tải xuống (1).jfif")
    img = Image.open(p).convert("RGB")
    arr = np.array(img)
    h, w, _ = arr.shape
    
    # Let's inspect background color: corners are (251, 247, 246), (230, 229, 227), etc.
    # The flower petals are pink/peach (R significantly higher than G and B)
    # and stems are yellowish-green (G > B).
    # Background is neutral / grayscale / slightly warm: |R-G| < 12 and |G-B| < 12, brightness > 215.
    r, g, b = arr[:, :, 0].astype(np.int32), arr[:, :, 1].astype(np.int32), arr[:, :, 2].astype(np.int32)
    chroma = np.maximum(np.maximum(np.abs(r - g), np.abs(r - b)), np.abs(g - b))
    lum = (r * 299 + g * 587 + b * 114) // 1000
    
    # Flower has chroma >= 14 OR lum < 205 (shadows inside flower)
    # Background has chroma < 14 AND lum > 215
    is_flower = (chroma >= 14) | (lum < 205)
    
    # Fill holes inside the flower using binary morphology
    flower_mask = is_flower.astype(np.uint8)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    flower_mask = cv2.morphologyEx(flower_mask, cv2.MORPH_CLOSE, kernel)
    
    # Remove small specks in background
    nb_components, output, stats, centroids = cv2.connectedComponentsWithStats(flower_mask, connectivity=8)
    sizes = stats[1:, -1]
    nb_components = nb_components - 1
    min_size = 500
    clean_mask = np.zeros(output.shape, dtype=np.uint8)
    for i in range(nb_components):
        if sizes[i] >= min_size:
            clean_mask[output == i + 1] = 255
            
    # Soft edge feathering
    clean_mask_blur = cv2.GaussianBlur(clean_mask, (7, 7), 2)
    
    rgba = np.dstack([arr, clean_mask_blur])
    Image.fromarray(rgba).save(os.path.join(out_dir, "flower_peony_trans.png"))
    print("Peony done")

# 3. Magnolia
def do_magnolia():
    p = os.path.join(asset_dir, "tải xuống (2).jfif")
    img = Image.open(p).convert("RGB")
    arr = np.array(img)
    h, w, _ = arr.shape
    
    r, g, b = arr[:, :, 0].astype(np.int32), arr[:, :, 1].astype(np.int32), arr[:, :, 2].astype(np.int32)
    whiteness = np.minimum(np.minimum(r, g), b)
    chroma = np.maximum(np.maximum(np.abs(r - g), np.abs(r - b)), np.abs(g - b))
    
    # Flower petals have chroma or whiteness < 245
    alpha = np.clip((248.0 - whiteness) / 20.0 * 255.0 + chroma * 4.0, 0, 255).astype(np.uint8)
    
    # Clean background corners
    cv2_mask = np.zeros((h + 2, w + 2), np.uint8)
    bg_seed = (alpha < 30).astype(np.uint8)
    for seed in [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1)]:
        cv2.floodFill(bg_seed, cv2_mask, seed, 2)
    alpha[bg_seed == 2] = 0
    
    alpha_im = Image.fromarray(alpha, mode="L").filter(ImageFilter.GaussianBlur(1.2))
    rgba = np.dstack([arr, np.array(alpha_im)])
    Image.fromarray(rgba).save(os.path.join(out_dir, "flower_magnolia_trans.png"))
    print("Magnolia done")

# 4. Red Rose
def do_rose():
    p = os.path.join(asset_dir, "tải xuống (3).jfif")
    img = Image.open(p).convert("RGB")
    arr = np.array(img)
    h, w, _ = arr.shape
    
    bg_color = np.array([233.0, 233.0, 233.0])
    diff = np.sqrt(np.sum((arr.astype(np.float32) - bg_color) ** 2, axis=2))
    
    mask = (diff > 25).astype(np.uint8) * 255
    # Smooth close
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    
    # Keep only largest connected component (the rose)
    nb_components, output, stats, centroids = cv2.connectedComponentsWithStats(mask, connectivity=8)
    sizes = stats[1:, -1]
    nb_components = nb_components - 1
    max_label = np.argmax(sizes) + 1
    rose_mask = np.zeros(output.shape, dtype=np.uint8)
    rose_mask[output == max_label] = 255
    
    # Soft feather
    rose_mask = cv2.GaussianBlur(rose_mask, (5, 5), 1.5)
    
    rgba = np.dstack([arr, rose_mask])
    Image.fromarray(rgba).save(os.path.join(out_dir, "flower_rose_trans.png"))
    print("Rose done")

do_blush()
do_peony()
do_magnolia()
do_rose()
