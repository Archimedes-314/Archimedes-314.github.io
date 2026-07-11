import subprocess
import sys
import os
from pathlib import Path
from pypdf import PdfWriter

def compress_pdf(input_path, output_path):
    gs_command = "gswin64c" if os.name == 'nt' else 'gs'
    params = [
        gs_command, "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.4",
        "-dPDFSETTINGS=/ebook", "-dAutoRotatePages=/None", "-dNOPAUSE",
        "-dQUIET", "-dBATCH", f"-sOutputFile={output_path}", str(input_path)
    ]
    try:
        subprocess.run(params, check=True)
        return True
    except Exception:
        return False

def run_shrink(source, destination):
    src = Path(source)
    dest = Path(destination)

    if src.is_file():
        print(f"Shrinking single file: {src.name}")
        compress_pdf(src, dest)
    
    elif src.is_dir():
        dest.mkdir(parents=True, exist_ok=True)
        pdfs = list(src.glob("*.pdf"))
        print(f"Bulk shrinking {len(pdfs)} files from folder...")
        for pdf in pdfs:
            print(f"  Processing {pdf.name}...")
            compress_pdf(pdf, dest / f"small_{pdf.name}")
    else:
        print(f"Error: {source} is not a valid file or folder.")

def run_merge(output_path, inputs):
    writer = PdfWriter()
    out = Path(output_path)
    
    out.parent.mkdir(parents=True, exist_ok=True)

    first_input = Path(inputs[0])
    
    if len(inputs) == 1 and first_input.is_dir():
        print(f"Merging all PDFs in folder: {first_input}")
        files_to_merge = sorted(list(first_input.glob("*.pdf")))
    else:
        print(f"Merging {len(inputs)} specific files...")
        files_to_merge = [Path(f) for f in inputs]

    for pdf in files_to_merge:
        if pdf.exists():
            print(f"  Adding {pdf.name}...")
            writer.append(str(pdf))
        else:
            print(f"  Warning: Skipping {pdf.name} (not found)")
            
    writer.write(out)
    print(f"Done! Merged file saved as: {out}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage:")
        print("  SHRINK: python pdf-tool.py shrink [input_file_or_folder] [output_file_or_folder]")
        print("  MERGE:  python pdf-tool.py merge [output_name.pdf] [input_folder OR file1.pdf file2.pdf...]")
        sys.exit(1)

    mode = sys.argv[1].lower()

    if mode == "shrink":
        run_shrink(sys.argv[2], sys.argv[3])
    elif mode == "merge":
        run_merge(sys.argv[2], sys.argv[3:])



# python C:\Users\escho\OneDrive\Documents\Maths\Website\maths-website\extras\pdf-tool\pdf-tool.py shrink input output
# python C:\Users\escho\OneDrive\Documents\Maths\Website\maths-website\extras\pdf-tool\pdf-tool.py merge output input