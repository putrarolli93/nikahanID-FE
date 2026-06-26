from PIL import Image

def remove_green_background(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Check if pixel is predominantly green (chroma key)
        # Bright green #00FF00
        if item[1] > 180 and item[0] < 100 and item[2] < 100:
            newData.append((255, 255, 255, 0)) # transparent
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")

remove_green_background("/Users/putrarolli/.gemini/antigravity-ide/brain/111ad2ad-0c64-4567-b1f2-1885c293aaa1/sakura_corner_1782426673972.png", "public/images/sakura.png")
