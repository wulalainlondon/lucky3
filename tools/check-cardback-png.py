#!/usr/bin/env python3
import os
import struct
import zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CARDBACK_DIR = os.path.join(ROOT, 'cardback')
EXPECTED_SIZE = (700, 994)
ALPHA_MAX = 40
DARK_MAX = 25
SUSPICIOUS_RATIO_MAX = 0.25
SUSPICIOUS_COUNT_MAX = 250


def read_chunks(data: bytes):
    if data[:8] != b'\x89PNG\r\n\x1a\n':
        raise ValueError('not a PNG')
    i = 8
    while i < len(data):
        if i + 8 > len(data):
            raise ValueError('truncated chunk header')
        length = struct.unpack('>I', data[i:i+4])[0]
        ctype = data[i+4:i+8]
        start = i + 8
        end = start + length
        if end + 4 > len(data):
            raise ValueError('truncated chunk payload')
        chunk = data[start:end]
        i = end + 4
        yield ctype, chunk
        if ctype == b'IEND':
            break


def paeth(a, b, c):
    p = a + b - c
    pa = abs(p - a)
    pb = abs(p - b)
    pc = abs(p - c)
    if pa <= pb and pa <= pc:
        return a
    if pb <= pc:
        return b
    return c


def decode_png_rgba(path):
    with open(path, 'rb') as f:
        data = f.read()

    width = height = None
    bit_depth = color_type = None
    idat = bytearray()

    for ctype, chunk in read_chunks(data):
        if ctype == b'IHDR':
            width, height, bit_depth, color_type, _, _, _ = struct.unpack('>IIBBBBB', chunk)
        elif ctype == b'IDAT':
            idat.extend(chunk)

    if width is None:
        raise ValueError('missing IHDR')
    if bit_depth != 8:
        raise ValueError(f'unsupported bit depth: {bit_depth}')
    if color_type not in (2, 6):
        raise ValueError(f'unsupported color type: {color_type}')

    bpp = 4 if color_type == 6 else 3
    raw = zlib.decompress(bytes(idat))
    stride = width * bpp
    pos = 0
    rows = []
    prev = bytearray(stride)

    for _ in range(height):
        ftype = raw[pos]
        pos += 1
        row = bytearray(raw[pos:pos+stride])
        pos += stride

        if ftype == 1:  # Sub
            for i in range(stride):
                left = row[i - bpp] if i >= bpp else 0
                row[i] = (row[i] + left) & 0xFF
        elif ftype == 2:  # Up
            for i in range(stride):
                row[i] = (row[i] + prev[i]) & 0xFF
        elif ftype == 3:  # Average
            for i in range(stride):
                left = row[i - bpp] if i >= bpp else 0
                up = prev[i]
                row[i] = (row[i] + ((left + up) >> 1)) & 0xFF
        elif ftype == 4:  # Paeth
            for i in range(stride):
                left = row[i - bpp] if i >= bpp else 0
                up = prev[i]
                up_left = prev[i - bpp] if i >= bpp else 0
                row[i] = (row[i] + paeth(left, up, up_left)) & 0xFF
        elif ftype != 0:
            raise ValueError(f'unsupported filter type: {ftype}')

        rows.append(row)
        prev = row

    return width, height, color_type, rows


def analyze(path):
    width, height, color_type, rows = decode_png_rgba(path)

    if (width, height) != EXPECTED_SIZE:
        return [f'size is {width}x{height}, expected {EXPECTED_SIZE[0]}x{EXPECTED_SIZE[1]}']

    if color_type != 6:
        return ['PNG has no alpha channel (color type != RGBA)']

    # Corners must be transparent for rounded, no-black-frame export
    corners = [
        rows[0][3],
        rows[0][(width-1) * 4 + 3],
        rows[height-1][3],
        rows[height-1][(width-1) * 4 + 3],
    ]
    errors = []
    if any(a != 0 for a in corners):
        errors.append('one or more corner pixels are not fully transparent (alpha != 0)')

    fringe = 0
    suspicious = 0
    for row in rows:
        for x in range(width):
            i = x * 4
            r, g, b, a = row[i], row[i+1], row[i+2], row[i+3]
            if 0 < a <= ALPHA_MAX:
                fringe += 1
                if max(r, g, b) <= DARK_MAX:
                    suspicious += 1

    if fringe > 0:
        ratio = suspicious / fringe
        if suspicious > SUSPICIOUS_COUNT_MAX and ratio > SUSPICIOUS_RATIO_MAX:
            errors.append(
                f'dark fringe suspected: {suspicious}/{fringe} low-alpha pixels are near black '
                f'(>{SUSPICIOUS_COUNT_MAX} and ratio {ratio:.2%})'
            )

    return errors


def main():
    files = sorted([f for f in os.listdir(CARDBACK_DIR) if f.lower().endswith('.png')])
    failed = False
    for name in files:
        path = os.path.join(CARDBACK_DIR, name)
        errs = analyze(path)
        if errs:
            failed = True
            print(f'[FAIL] {name}')
            for e in errs:
                print(f'  - {e}')
        else:
            print(f'[OK]   {name}')

    if failed:
        raise SystemExit(1)
    print(f'\nAll {len(files)} cardback PNG files passed size/alpha checks.')


if __name__ == '__main__':
    main()
