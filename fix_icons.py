import os
from PIL import Image, ImageFilter

def create_premium_icon(source_path, target_path, size):
    if not os.path.exists(source_path):
        print(f"Source {source_path} not found")
        return
    
    img = Image.open(source_path)
    # The source is 1024x1024 approx (based on 2.2MB size likely)
    # Crop to square if not already
    w, h = img.size
    min_dim = min(w, h)
    left = (w - min_dim) / 2
    top = (h - min_dim) / 2
    right = (w + min_dim) / 2
    bottom = (h + min_dim) / 2
    img = img.crop((left, top, right, bottom))
    
    # Resize with high quality
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    
    # Save optimized
    img.save(target_path, "PNG", optimize=True)
    print(f"Created {target_path} ({size}x{size})")

source = "/home/team/shared/EmpireLaunchAI-frontend/public/branded-globe.png"
# Create Apple Icon (180x180)
create_premium_icon(source, "/home/team/shared/EmpireLaunchAI-frontend/public/apple-v10.png", 180)
# Create Standard Icon (512x512)
create_premium_icon(source, "/home/team/shared/EmpireLaunchAI-frontend/public/icon-v10.png", 512)
# Also create the general icon.png
create_premium_icon(source, "/home/team/shared/EmpireLaunchAI-frontend/public/icon.png", 512)
# And the apple-touch-icon.png
create_premium_icon(source, "/home/team/shared/EmpireLaunchAI-frontend/public/apple-touch-icon.png", 180)

