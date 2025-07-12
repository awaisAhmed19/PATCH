import os
import google.generativeai as genai
import subprocess
import csv
import json # Assuming scan_data might be a JSON-like structure
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS # Import CORS

# --- Flask App Setup ---
app = Flask(__name__)
CORS(app)

# Configure your Gemini API key (replace with your actual key or set as environment variable)
# os.environ["GEMINI_API_KEY"] = "YOUR_GEMINI_API_KEY"

def get_gemini_python_code(prompt):
    """
    Takes a prompt and asks the Gemini model to generate Python code for CSV data extraction. 
    """
    try:
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    except KeyError:
        print("Error: GEMINI_API_KEY environment variable not set.")
        print("Please set your Gemini API key as an environment variable.")
        print("You can get one from Google AI Studio: https://aistudio.google.com/app/apikey")
        return None

    try:
        # Using a GenerativeModel for text generation
        # 'gemini-pro' or 'gemini-1.5-flash' are good choices for code generation.
        # 'gemini-2.5-flash' from your original prompt might not be publicly available
        # or may be an internal model. Using a generally available model here.
        model = genai.GenerativeModel('gemini-2.5-flash') # Or 'gemini-pro'
        
        # The system instruction is crucial here to guide Gemini to produce Python code.
        response = model.generate_content(
            contents=[
                {"role": "user", "parts": ["You are a Python code assistant. Your task is to generate safe Python code snippets for extracting and processing data from a CSV file. Wrap it in markdowns. The code should be ready to execute. The output of the code should be in a format, that can be fed back into your model for analysis.The code should assign its final, extracted data (e.g., a list of dictionaries, a string summary) to a variable named `result_data`. Do not include any explanation, just the code block. Use the `csv` module for CSV operations. If the user asks for something that can't be safely done in Python, respond with 'Error: Unsafe operation requested.' This is the file path for extraction 'Vulnerability_Logs/Vulnerability_logs.csv'.the fields in the csv file are :Timestamp,Host,Hostname,OS,ID,Port,Service,Vulnerability,Patch/ Mitigation,Priority,Status. The values of Priority are : Critical, High, Medium, Low. The range of values for Status are : Pending, In Progress and Patched. "]},
                {"role": "user", "parts": [prompt]}
            ]
        )
        
        # Extracting just the code block, assuming Gemini wraps it in markdown
        generated_code = response.text.strip()
        if generated_code.startswith("```python") and generated_code.endswith("```"):
            return generated_code[len("```python"): -len("```")].strip()
        elif generated_code.startswith("```") and generated_code.endswith("```"): # In case it just gives generic code block
            return generated_code[len("```"): -len("```")].strip()
        return generated_code # Return as is if no code block markers
        
    except Exception as e:
        print(f"An error occurred during Gemini code generation: {e}")
        return None


def get_gemini_response(prompt):
    """
    Takes a prompt and asks the Gemini model to generate Python code for CSV data extraction.
    """
    try:
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    except KeyError:
        print("Error: GEMINI_API_KEY environment variable not set.")
        print("Please set your Gemini API key as an environment variable.")
        print("You can get one from Google AI Studio: https://aistudio.google.com/app/apikey")
        return None

    try:
        # Using a GenerativeModel for text generation
        # 'gemini-pro' or 'gemini-1.5-flash' are good choices for code generation.
        # 'gemini-2.5-flash' from your original prompt might not be publicly available
        # or may be an internal model. Using a generally available model here.
        model = genai.GenerativeModel('gemini-2.5-flash') # Or 'gemini-pro'
        question=f"""Just talk about the information listed.  If you are fed an empty set, it means there are no rows with that info, return "No data found".
                {prompt}"""

        # The system instruction is crucial here to guide Gemini to produce Python code.
        response = model.generate_content(question)
        return response.text.strip()
        
       
        
    except Exception as e:
        print(f"An error occurred during Gemini code generation: {e}")
        return None


def run_python_code(code):
    """
    Executes the generated Python code.
    The generated code should assign its output to a variable named 'result_data'
    which will be captured by the exec_globals.
    """
    print(f"\n--- Executing Python Code ---\n")
    try:
        exec_globals = {
            'print': print,
            'open': open,
            'csv': csv,
            'result_data': None # Initialize a variable to capture the output from executed code
        }
        
        # Execute the generated Python code
        exec(code, exec_globals)
        
        # Now, retrieve the data that the executed code stored in 'result_data'
        captured_data = exec_globals.get('result_data') 
        
        # Print the captured data (for debugging/observation)
        print("Captured data from executed Python code:")
        print(captured_data)
        
        # Pass the captured data to get_gemini_response
        # Ensure 'captured_data' is a string or can be easily converted for the prompt
        if captured_data is not None:
            final_response = get_gemini_response(str(captured_data)) # Convert to string for prompt
            print("\n--- Gemini's Final Response ---")
            print(final_response)
        else:
            print("The executed Python code did not produce any data in 'result_data'.")

        print("\n--- Python Code Execution Finished ---")
    except Exception as e:
        print(f"Error executing Python code: {e}")

# --- Main execution flow ---

if __name__ == "__main__":

    #python_prompt = "Write Python code to read 'scan_data.csv' and print all 'VulnerabilityID's."
    user_prompt=input("Enter Your Questions:")
    generated_python_code = get_gemini_python_code(user_prompt)

    if generated_python_code:
        print(f"\n--- Generated Python Code ---")
        print(generated_python_code)
        print("Enter 1 if you want to run the code else 0:")
        option = int(input())
        if option == 1:
            print("Running the generated Python code...")   
            run_python_code(generated_python_code)
        else:
            print("Skipping code execution.")

    else:
        print("Failed to generate Python code.")

    print("\n" + "="*50 + "\n")

 
