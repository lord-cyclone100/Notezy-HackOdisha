from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv()

api = os.getenv("GEMINI_API")
llm = "gemini-2.0-flash-001"

# Configure the API key
client = genai.Client(
    api_key=api,
    http_options=types.HttpOptions(api_version='v1alpha')
)

instruction = "You are a helpful study guide. You will receive long text inputs, which can be any language, but you will respond in english only, unless asked otherwise. Your task is to summarize that text into 400 words or less. List the key topics as points. Do this, unless stated otherwise. If it is asked to explain a topic which is not included in the transcript, briefly respond that the requested content is not available. Just generate the summary. No need to generate content like 'Here's a summary of the text about the topic'. Don't mention the word 'video' anywhere in the response. Generate the response in markdown format."

title_instruction = "You are a helpful assistant. Based on the provided transcript text, generate a concise, descriptive title (maximum 80 characters) that captures the main topic or theme. The title should be engaging and informative. Don't mention the word 'video' in the title. Just return the title text without any additional formatting or explanation."

questions_instruction = "You are an educational assistant. Based on the provided text content, generate 8-12 study questions that will help students understand and review the key concepts. Create a mix of question types: multiple choice, short answer, and essay questions. Format your response in markdown with clear headings for each question type. Make the questions challenging but fair, covering different aspects and difficulty levels of the content. Do not reference 'video' or 'transcript' in the questions."

test_instruction = "You are an educational assessment creator. Based on the provided text content from multiple notes, generate 15-20 multiple choice questions (MCQs) for a comprehensive test. Each question should have exactly 4 options (A, B, C, D) with only one correct answer. Make the questions challenging but fair, covering different concepts from the content. Format your response in clean markdown with clear numbering. At the end, include an 'Answer Key' section with the correct answers in the format: '1. A, 2. B, 3. C, etc.' Do not reference 'video', 'transcript', or 'notes' in the questions. Focus on testing understanding of key concepts, definitions, relationships, and applications."

content_validation_instruction = "You are a content validator for an educational application. Your task is to determine if the provided text content is related to educational, academic, or study purposes. Educational content includes: academic subjects, tutorials, lectures, educational explanations, skill development, professional training, science, mathematics, history, literature, language learning, certification courses, etc. Non-educational content includes: entertainment, gaming, personal vlogs, comedy, music videos, movie reviews, gossip, non-educational personal stories, etc. Respond with only 'EDUCATIONAL' if the content is study-related, or 'NON_EDUCATIONAL' if it's not related to studies. Do not provide any explanation."

def validate_educational_content(transcript):
    """
    Validates if the content is educational/study-related
    Returns True if educational, False if not
    """
    validation_response = client.models.generate_content(
        model=llm,
        contents=transcript,
        config=types.GenerateContentConfig(
            system_instruction=content_validation_instruction,
            temperature=0.1,  # Low temperature for consistent validation
        )
    )
    
    validation_result = validation_response.text.strip().upper()
    return validation_result == "EDUCATIONAL"

def generate_summary(transcript):
    # First validate if content is educational
    if not validate_educational_content(transcript):
        return {
            'title': 'Non-Educational Content',
            'summary': 'Sorry, this content is not related to study purposes. This application is designed for educational content only.',
            'is_educational': False
        }
    
    # Generate summary
    summary_response = client.models.generate_content(
        model=llm,
        contents=transcript,
        config=types.GenerateContentConfig(
            system_instruction=instruction,
            temperature=0.3,
        )
    )
    
    # Generate title
    title_response = client.models.generate_content(
        model=llm,
        contents=transcript,
        config=types.GenerateContentConfig(
            system_instruction=title_instruction,
            temperature=0.3,
        )
    )
    
    return {
        'title': title_response.text.strip(),
        'summary': summary_response.text.strip(),
        'is_educational': True
    }

def generate_questions(content):
    # Generate questions
    questions_response = client.models.generate_content(
        model=llm,
        contents=content,
        config=types.GenerateContentConfig(
            system_instruction=questions_instruction,
            temperature=0.4,
        )
    )
    
    return {
        'questions': questions_response.text.strip()
    }

def generate_test(content):
    # Generate test
    test_response = client.models.generate_content(
        model=llm,
        contents=content,
        config=types.GenerateContentConfig(
            system_instruction=test_instruction,
            temperature=0.4,
        )
    )
    
    return {
        'test': test_response.text.strip()
    }

# print(response.text)
# print(type(response.text))
