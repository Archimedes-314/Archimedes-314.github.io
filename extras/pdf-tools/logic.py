import io
from pypdf import PdfWriter, PdfReader
from PIL import Image

def merge_pdfs(file_list):
    writer = PdfWriter()
    for file_bytes in file_list:
        reader = PdfReader(io.BytesIO(bytes(file_bytes)))
        writer.append(reader)
    
    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def compress_pdf_bridge(input_bytes, quality=30):
    reader = PdfReader(io.BytesIO(bytes(input_bytes)))
    writer = PdfWriter()

    for page in reader.pages:
        
        if "/Resources" in page and "/XObject" in page["/Resources"]:
            x_objects = page["/Resources"]["/XObject"].get_object()
            
            for obj_name in x_objects:
                obj = x_objects[obj_name]
                
                if obj["/Subtype"] == "/Image":
                    try:
                        img_data = obj.get_data()
                        img = Image.open(io.BytesIO(img_data))
                        if img.width > 1200 or img.height > 1200:
                            img.thumbnail((1200, 1200), Image.Resampling.LANCZOS)

                        if img.mode != "RGB":
                            img = img.convert("RGB")
                        
                        img_tmp = io.BytesIO()
                        img.save(img_tmp, format="JPEG", quality=quality, optimize=True)
                        
                        obj.update({
                            "/Filter": "/DCTDecode",
                            "/Contents": img_tmp.getvalue(),
                            "/Width": img.width,
                            "/Height": img.height
                        })
                        
                        if "/SMask" in obj:
                            del obj["/SMask"]
                            
                    except Exception as e:
                        print(f"Skipping image {obj_name}: {str(e)}")

        writer.add_page(page)

    output_stream = io.BytesIO()
    writer.write(output_stream)
    
    return output_stream.getvalue()