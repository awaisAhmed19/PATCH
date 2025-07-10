from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Extract facts from Nmap JSON
def extract_context(data):
    facts = []
    for host in data.get("hosts", []):
        ip = host.get("address", "Unknown IP")
        hostnames = ", ".join(host.get("hostnames", [])) or "No hostname"
        os_info = host.get("os", {}).get("name", "Unknown OS")

        for port in host.get("ports", []):
            port_id = port.get("portid")
            service_name = port.get("service", {}).get("name", "unknown service")

            for vuln in port.get("vulnerabilities", []):
                facts.append(
                    f"""Host: {ip} ({hostnames})
OS: {os_info}
Port {port_id} ({service_name}): {vuln['output']}"""
                )
    return "\n".join(facts)

# Gemini call
def get_gemini_response(prompt_text):
    try:
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    except KeyError:
        return "Error: GEMINI_API_KEY not set"

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt_text)
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"

# Default question
DEFAULT_QUESTION = (
    "Explain the vulnerabilities and suggest mitigations, "
    "along with commands based on the OS. "
    "Also list the severity and priority of the vulnerabilities."
)

# POST endpoint
@app.route("/llm-response", methods=["POST"])
def llm_response():
    try:
        scan_data = request.get_json()
        if not scan_data:
            return jsonify({"error": "No JSON payload received"}), 400
    except Exception as e:
        return jsonify({"error": f"Invalid JSON: {e}"}), 400

    try:
        context = extract_context(scan_data)
    except Exception as e:
        return jsonify({"error": f"Failed to parse Nmap data: {e}"}), 400

    prompt = f"""Here are the scan results from an Nmap scan:

{context}

Question: {DEFAULT_QUESTION}
Answer based on the above data.
"""
    response = get_gemini_response(prompt)
    return jsonify({"response": response})

# Run server
if __name__ == "__main__":
    app.run(port=8000, debug=True)
