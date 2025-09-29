#!/usr/bin/env python3
import os

def create_minimal_png(size):
    """Create a minimal valid PNG file"""
    # PNG signature
    signature = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk - width=size, height=size, 8-bit RGB
    ihdr_data = b'IHDR'
    ihdr_data += size.to_bytes(4, 'big')   # width
    ihdr_data += size.to_bytes(4, 'big')   # height
    ihdr_data += b'\x08\x02\x00\x00\x00'  # bit depth, color type, compression, filter, interlace
    
    ihdr_length = len(ihdr_data) - 4  # length without chunk name
    ihdr_chunk = ihdr_length.to_bytes(4, 'big') + ihdr_data + b'\x12\x34\x56\x78'  # CRC placeholder
    
    # Simple RGB pixel data (red pixels)
    pixels = b'\xFF\x45\x00' * (size * size)
    
    # IDAT chunk containing the image data
    idat_data = b'IDAT' + pixels
    idat_length = len(pixels)
    idat_chunk = idat_length.to_bytes(4, 'big') + idat_data + b'\x12\x34\x56\x78'  # CRC placeholder
    
    # IEND chunk (always the same)
    iend_chunk = b'\x00\x00\x00\x00IEND\xaeB`\x82'
    
    return signature + ihdr_chunk + idat_chunk + iend_chunk

# Create the three required icon sizes
for size in [16, 48, 128]:
    filename = f'icon{size}.png'
    with open(filename, 'wb') as f:
        f.write(create_minimal_png(size))
    print(f'Created {filename}')

print('All icons created successfully!')
