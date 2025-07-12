# Built-ins
import os
import re
import csv
import json
from datetime import datetime

# Third-party
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Local
from Backend.parser.nmap_parser import parse_nmap_xml

load_dotenv()  # loads env vars from .env file into os.environ
app = Flask(__name__)
CORS(app)


def extract_priority_and_patch(response_text, vuln_id):
    """
    Extracts {id, priority} and [id, patch_content] from the LLM response.
    """

    # Priority Extraction: looks for {ID, Priority}
    priority_match = re.search(
        rf"\{{\s*{re.escape(vuln_id)}\s*,\s*(Critical|High|Medium|Low)\s*\}}",
        response_text,
        re.IGNORECASE,
    )
    priority = priority_match.group(1).capitalize() if priority_match else "Unknown"

    # Patch Extraction: looks for Patches: [ID, patch...]

    patch_pattern = rf"Patches:\s*\[\s*{re.escape(vuln_id)}\s*,([\s\S]*?)\]"
    patch_match = re.search(patch_pattern, response_text, re.IGNORECASE)
    patch = patch_match.group(1).strip() if patch_match else "Not specified"

    return priority, patch


def save_response_to_file(response_text):
    now = datetime.now()
    date = now.strftime("%Y-%m-%d")
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    # filename = f"vulnerability_log_{date}.txt"  # fixed log file
    os.makedirs("Vulnerability_Logs", exist_ok=True)
    filename = os.path.join("Vulnerability_Logs", f"vulnerability_log_{date}.txt")

    with open(filename, "a", encoding="utf-8") as f:
        f.write("=" * 80 + "\n")
        f.write(f"Timestamp: {timestamp}\n\n")
        f.write("Nmap Scan Results:\n")
        f.write(response_text + "\n")
        f.write("=" * 80 + "\n\n")

    print(f"✅ Response appended to {filename}")


# from extract_utils import extract_priority_and_patch  # assuming it's imported


def append_vulnerabilities_to_csv(scan_data, llm_response):
    filename = "Vulnerability_Logs/Vulnerability_logs.csv"
    now = datetime.now()
    timestamp = now.strftime("%Y-%m-%d %H:%M:%S")
    os.makedirs("Vulnerability_Logs", exist_ok=True)

    file_exists = os.path.isfile(filename)

    with open(filename, "a", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)

        if not file_exists:
            writer.writerow(
                [
                    "Timestamp",
                    "Host",
                    "Hostname",
                    "OS",
                    "Port",
                    "Service",
                    "Vulnerability",
                    "Patch/ Mitigation",
                    "Priority",
                    "Status",
                ]
            )

        for host in scan_data.get("hosts", []):
            ip = host.get("address", "Unknown IP")
            hostnames = ", ".join(host.get("hostnames", [])) or "No hostname"
            os_info = host.get("os", {}).get("name", "Unknown OS")

            for port in host.get("ports", []):
                port_id = port.get("portid")
                service_name = port.get("service", {}).get("name", "unknown service")

                for vuln in port.get("vulnerabilities", []):
                    vuln_id = vuln.get("id", "unknown-id")
                    vuln_desc = vuln.get("output", "No description")

                    # Extract patch and priority using vuln_id from LLM response
                    priority, patch = extract_priority_and_patch(llm_response, vuln_id)

                    writer.writerow(
                        [
                            timestamp,
                            ip,
                            hostnames,
                            os_info,
                            vuln_id,
                            port_id,
                            service_name,
                            vuln_desc,
                            patch,
                            priority,
                            "Pending",
                        ]
                    )

    print(f"✅ CSV rows appended to {filename}")


# Extract facts from Nmap JSON
def extract_context(data):
    facts = []

    for host in data.get("hosts", []):
        ip = host.get("address", "Unknown IP")
        hostnames = ", ".join(host.get("hostnames", [])) or "No hostname"
        os_info = host.get("os", {}).get("name", "Unknown OS")

        for port in host.get("ports", []):
            port_id = port.get("portid", "N/A")
            service_name = port.get("service", {}).get("name", "unknown service")

            for vuln in port.get("vulnerabilities", []):
                vuln_id = vuln.get("id", "No ID")
                vuln_output = vuln.get("output", "No description")

                facts.append(
                    f"""Host: {ip} ({hostnames})
OS: {os_info}
Port {port_id} ({service_name})
Vulnerability ID: {vuln_id}
Details: {vuln_output}"""
                )

    return "\n\n".join(facts)


# Gemini call
def get_gemini_response(prompt_text):
    try:
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    except KeyError:
        return "Error: GEMINI_API_KEY not set"

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt_text)
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"


# Default question
DEFAULT_QUESTION = (
    "Explain the vulnerabilities and suggest mitigations, "
    "along with commands based on the OS. "
    "Also list the severity and priority of the vulnerabilities."
    "the priority should have values {Critical, High, Medium, Low} placed inside {} brackets, along with their id {id, Priority} where id is id of vulnerability like 'vulners'. "
    "Also place the suggested mitigations inside [] brackets for each vulnerability. in the format. Patches: [id, content] where id is id of vulnerability like 'vulners'."
)


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

    # Save the result
    append_vulnerabilities_to_csv(scan_data, response)
    save_response_to_file(response)

    return jsonify({"response": response})


# test
# with open("scan_file_path", "r") as scan:
#   print(llm_response(scan))
##if __name__ == "__main__":
##  with open("test.json", "r") as f:
#   scan_data = json.load(f)  # ✅ This is now a dict

# context = extract_context(scan_data)  # ✅ This works now
# print("📄 Extracted Context:\n")
# print(context)

# prompt = f"""Here are the scan results from an Nmap scan:

# {context}

# Question: {DEFAULT_QUESTION}
# Answer based on the above data.
# """
# print("\n🤖 Gemini LLM Response:\n")

# print("GEMINI_API_KEY:", os.environ.get("GEMINI_API_KEY"))
# response = get_gemini_response(prompt)
# print(response)
