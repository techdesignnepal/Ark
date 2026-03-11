from PIL import Image
import sys

def process(infile):
    img = Image.open(infile).convert("RGBA")
    datas = img.getdata()
    bg_color = datas[0] # assume top-left pixel is background
    
    # tolerance
    tol = 30
    
    newData = []
    for item in datas:
        if abs(item[0]-bg_color[0]) < tol and abs(item[1]-bg_color[1]) < tol and abs(item[2]-bg_color[2]) < tol:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(infile, "PNG")

process("public/ark-part-1.png")
process("public/ark-part-2.png")
process("public/ark-part-3.png")
