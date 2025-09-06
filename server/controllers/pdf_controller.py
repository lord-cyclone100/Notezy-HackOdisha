from flask import request, jsonify
import PyPDF2
import io
from genai.genai import generate_summary

def process_pdf():
    try:
        # Check if a file was uploaded
        if 'pdf' not in request.files:
            return jsonify({'error': 'No PDF file uploaded'}), 400
        
        file = request.files['pdf']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check if file is PDF
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are allowed'}), 400
        
        # Read PDF content
        pdf_content = ""
        try:
            # Read the file content
            file_content = file.read()
            
            # Create a BytesIO object
            pdf_file = io.BytesIO(file_content)
            
            # Create PDF reader
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            # Extract text from all pages
            for page_num, page in enumerate(pdf_reader.pages):
                page_text = page.extract_text()
                if page_text.strip():  # Only add non-empty pages
                    pdf_content += f"\n\n--- Page {page_num + 1} ---\n\n"
                    pdf_content += page_text
            
            if not pdf_content.strip():
                return jsonify({'error': 'No text content found in the PDF'}), 400
                
        except Exception as e:
            return jsonify({'error': f'Error reading PDF: {str(e)}'}), 500
        
        # Generate summary using AI
        try:
            ai_response = generate_summary(pdf_content)
            summary = ai_response.get('summary', pdf_content)
            title = ai_response.get('title', f"PDF Summary: {file.filename}")
            
            # Check if content is educational
            if not ai_response.get('is_educational', True):
                return jsonify({
                    'message': summary,
                    'title': title,
                    'is_educational': False
                }), 400  # Return 400 status for non-educational content
            
            return jsonify({
                'message': summary,
                'title': title,
                'original_content': pdf_content,
                'filename': file.filename,
                'is_educational': True
            })
            
        except Exception as e:
            # If AI summary fails, return the raw content
            return jsonify({
                'message': pdf_content,
                'title': f"PDF Content: {file.filename}",
                'original_content': pdf_content,
                'filename': file.filename
            })
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500
