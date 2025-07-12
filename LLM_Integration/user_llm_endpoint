import os
import google.generativeai as genai
import csv
import json
import pandas as pd # Included as per your original script
from flask import Flask, request, jsonify
from flask_cors import CORS # Import CORS

# --- Flask App Setup ---
app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# --- Configuration ---
# IMPORTANT: Set your GEMINI_API_KEY as an environment variable.
# For example:
# export GEMINI_API_KEY='YOUR_API_KEY_HERE' (Linux/macOS)
# set GEMINI_API_KEY='YOUR_API_KEY_HERE' (Windows Command Prompt)
# $env:GEMINI_API_KEY='YOUR_API_KEY_HERE' (Windows PowerShell)

CSV_FILE_PATH = 'Vulnerability_Logs/Vulnerability_logs.csv'
VULNERABILITY_LOGS_DIR = 'Vulnerability_Logs'

# --- Helper Function to Create Mock CSV ---
def create_mock_csv(file_path):
    """
    Creates a mock CSV file with vulnerability data if it doesn't exist.
    This is for demonstration purposes so the generated Python code has data to read.
    """
    if not os.path.exists(VULNERABILITY_LOGS_DIR):
        os.makedirs(VULNERABILITY_LOGS_DIR)
        print(f"Created directory: {VULNERABILITY_LOGS_DIR}")

    if not os.path.exists(file_path):
        print(f"Creating mock CSV file: {file_path}")
        with open(file_path, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['Timestamp', 'Host', 'Hostname', 'OS', 'ID', 'Port', 'Service', 'Vulnerability', 'Patch/ Mitigation', 'Priority', 'Status'])
            writer.writerow(['11-07-2025 12:02', '192.168.1.10', 'test-vulnerable-host.local', 'Linux 3.2 - 4.9', 'http-vuln-cve2017-5638', '80', 'http', 'Apache Struts vulnerability detected (CVE-2017-5638)', '"Upgrade Apache Struts to a patched version (e.g., 2.3.32, 2.5.10.1, or 2.5.12+). If an immediate upgrade is not feasible, implement a Web Application Firewall (WAF) to filter and block malicious requests targeting the `Content-Type` header, or apply a servlet filter to validate and sanitize input for OGNL expressions."', 'Critical', 'Pending'])
            writer.writerow(['11-07-2025 12:02', '192.168.1.10', 'test-vulnerable-host.local', 'Linux 3.2 - 4.9', 'smb-vuln-ms17-010', '445', 'microsoft-ds', 'Host is vulnerable to MS17-010 (EternalBlue)', '"Upgrade Samba to a patched version that addresses the MS17-010 vulnerability (e.g., Samba 4.6.4, 4.5.10, 4.4.14 or newer). Additionally, it is highly recommended to disable the SMBv1 protocol on the server if it\'s not strictly required by legacy systems, and block SMB traffic (TCP ports 139 and 445) at the firewall from untrusted networks."', 'Critical', 'Pending'])
            writer.writerow(['11-07-2025 12:03', '192.168.1.11', 'another-server.local', 'Windows Server 2016', 'cve-2023-1234', '3389', 'ms-wbt-server', 'RDP vulnerability (CVE-2023-1234)', '"Apply latest security updates for Windows Server 2016. Restrict RDP access to trusted IPs only."', 'High', 'Pending'])
            writer.writerow(['11-07-2025 12:04', '192.168.1.12', 'web-app.local', 'Ubuntu 20.04', 'cve-2022-5678', '8080', 'tomcat', 'Apache Tomcat Information Disclosure (CVE-2022-5678)', '"Upgrade Apache Tomcat to a secure version (e.g., 9.0.70+ or 10.1.0+). Review and harden Tomcat configuration to prevent directory listings and sensitive file exposure."', 'Medium', 'Patched'])


# --- Gemini Interaction Functions ---

def get_gemini_python_code(prompt):
    """
    Takes a prompt and asks the Gemini model to generate Python code for CSV data extraction.
    The code should assign its final, extracted data to a variable named `result_data`.
    """
    try:
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    except KeyError:
        print("Error: GEMINI_API_KEY environment variable not set.")
        return None

    try:
        # Using gemini-2.5-flash as requested.
        # Note: Model availability might vary based on your API key and region.
        # If you encounter issues, try 'gemini-1.5-flash' or 'gemini-pro'.
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # The system instruction is crucial here to guide Gemini to produce Python code.
        # We explicitly tell it to assign the output to `result_data`.
        system_instruction = (
            "You are a Python code assistant. Your task is to generate safe Python code snippets "
            "for extracting and processing data from a CSV file. Wrap it in markdowns. The code should be ready to execute. "
            "The output of the code should be in a format that can be fed back into your model for analysis. "
            "The code must assign its final, extracted data (e.g., a list of dictionaries, a string summary) "
            "to a variable named `result_data`. Do not include any explanation or conversational text, just the code block. "
            "Use the `csv` module for CSV operations. If the user asks for something that can't be safely done in Python, "
            "respond with 'Error: Unsafe operation requested.'. The CSV file path for extraction is "
            f"'{CSV_FILE_PATH}'. The fields in the CSV file are: Timestamp, Host, Hostname, OS, ID, Port, Service, "
            "Vulnerability, Patch/ Mitigation, Priority, Status. The values of Priority are: Critical, High, Medium, Low. "
            "The range of values for Status are: Pending, In Progress and Patched. "
        )

        response = model.generate_content(
            contents=[
                {"role": "user", "parts": [system_instruction]},
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

def get_gemini_analysis_response(prompt_text):
    """
    Takes a prompt (which will be the extracted data) and asks the Gemini model
    to talk about the information listed.
    """
    try:
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    except KeyError:
        print("Error: GEMINI_API_KEY environment variable not set.")
        return "API Key not configured."

    try:
        model = genai.GenerativeModel('gemini-2.5-flash') # Using gemini-2.5-flash for analysis
        
        # The prompt for analysis
        question = f"""Just talk about the information listed. If you are fed an empty set or empty list, it means there are no rows with that info, return "No data found".

{prompt_text}

Provide a concise analysis focusing on key vulnerabilities, priorities, and suggested mitigations.
"""

        response = model.generate_content(question)
        return response.text.strip()
        
    except Exception as e:
        print(f"An error occurred during Gemini analysis: {e}")
        return f"Could not generate analysis: {str(e)}"

def run_python_code_and_capture_data(code):
    """
    Executes the generated Python code and captures its output assigned to 'result_data'.
    """
    print(f"\n--- Executing Python Code ---\n")
    exec_globals = {
        'print': print, # Allow print within the executed code (for debugging if needed)
        'open': open,   # Allow file operations
        'csv': csv,     # Allow csv module
        'json': json,   # Allow json module if generated code uses it
        'pandas': pd,   # Allow pandas if generated code uses it
        'result_data': None # Initialize a variable to capture the output
    }
    
    try:
        # Execute the generated Python code
        # WARNING: Using exec() with AI-generated code carries significant security risks.
        # Ensure your system prompt heavily restricts the type of code generated.
        exec(code, exec_globals)
        
        # Retrieve the data that the executed code stored in 'result_data'
        captured_data = exec_globals.get('result_data') 
        
        print("Captured data from executed Python code:")
        print(captured_data) # This will print the actual data captured
        
        return captured_data
        
    except Exception as e:
        print(f"Error executing Python code: {e}")
        return f"Error during code execution: {str(e)}"

# --- Flask Endpoint ---
@app.route("/user_side_llm", methods=["POST"])
def user_side_llm_endpoint():
    try:
        request_data = request.get_json()
        if not request_data or "question" not in request_data:
            return jsonify({"error": "Invalid request: 'question' field missing in JSON body"}), 400
        
        user_prompt = request_data["question"]

        # Ensure the mock CSV file exists for the generated Python code to read
        create_mock_csv(CSV_FILE_PATH)

        # 1. Get Python code from Gemini based on user's question
        generated_python_code = get_gemini_python_code(user_prompt)

        if not generated_python_code:
            return jsonify({"error": "Failed to generate Python code from Gemini."}), 500

        print(f"\n--- Generated Python Code ---")
        print(generated_python_code)

        # 2. Run the generated Python code and capture its output
        extracted_data = run_python_code_and_capture_data(generated_python_code)

        if extracted_data is None:
            return jsonify({"error": "The generated Python code did not produce any data in 'result_data'."}), 500
        if isinstance(extracted_data, str) and extracted_data.startswith("Error:"):
             return jsonify({"error": f"Error during data extraction: {extracted_data}"}), 500
        # Check for empty list/dict for "No data found" condition
        if not extracted_data: # Handles empty list, empty dict, or other "falsy" empty collections
            return jsonify({"analysis": "No data found", "extracted_data": extracted_data}), 200


        # 3. Pass the extracted data to Gemini for analysis
        # Convert extracted_data to a string representation suitable for the LLM prompt
        analysis_prompt = json.dumps(extracted_data, indent=2) if isinstance(extracted_data, (list, dict)) else str(extracted_data)
        
        final_analysis_response = get_gemini_analysis_response(analysis_prompt)

        if not final_analysis_response:
            return jsonify({"error": "Failed to get analysis from Gemini."}), 500

        return jsonify({"analysis": final_analysis_response, "extracted_data": extracted_data}), 200

    except KeyError:
        return jsonify({"error": "GEMINI_API_KEY environment variable not set. Please configure it."}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500

# --- Run the Flask App ---
if __name__ == "__main__":
    # In a production environment, use a production-ready WSGI server like Gunicorn
    # app.run(host='0.0.0.0', port=8005, debug=False)
    app.run(port=8005, debug=True) # debug=True for development, auto-reloads on code changes
