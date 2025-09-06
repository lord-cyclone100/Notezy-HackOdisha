import PyPDF2

with open("hello.pdf","rb") as f:
  reader = PyPDF2.PdfReader(f)
  for i, page in enumerate(reader.pages):
    print(f"Page {i+1}:")
    print(page.extract_text())