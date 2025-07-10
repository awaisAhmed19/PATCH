import os
import google.generativeai as genai
import json

def load_context(json_path):
    with open(json_path) as f:
        data = json.load(f)

    facts = []
    for host in data["hosts"]:
        ip = host.get("address", "Unknown IP")
        hostnames = ", ".join(host.get("hostnames", [])) or "No hostname"

        # Add OS info if available
        os_info = host.get("os", {}).get("name", "Unknown OS")

        for port in host.get("ports", []):
            port_id = port.get("portid")
            service_name = port.get("service", {}).get("name", "unknown service")

            for vuln in port.get("vulnerabilities", []):
                facts.append(
                    f"""Host: {ip} ({hostnames})
                      OS: {os_info}
                       Port {port_id} ({service_name}): {vuln['output']}
                         """
                )
    return "\n".join(facts)

def get_gemini_response(prompt_text):
    """
    Takes a user prompt as input and passes it to the Gemini model,
    then returns the model's response.k
    
    """
    # Configure your API key
    # It's highly recommended to set this as an environment variable
    # For example: export GEMINI_API_KEY='YOUR_API_KEY' in your terminal
    try:
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    except KeyError:
        print("Error: GEMINI_API_KEY environment variable not set.")
        print("Please set your Gemini API key as an environment variable.")
        print("You can get one from Google AI Studio: https://aistudio.google.com/app/apikey")
        return "API Key not configured."

    # Choose a Gemini model
    # You can explore available models and their capabilities in the documentation:
    # https://ai.google.dev/models/gemini
    model = genai.GenerativeModel('gemini-2.5-flash') # 'gemini-pro' is a good general-purpose model

    try:
        # Generate content from the prompt
        response = model.generate_content(prompt_text)

        # Access the generated text
        return response.text

    except Exception as e:
        print(f"An error occurred: {e}")
        return "Could not generate a response."

if __name__ == "__main__":
    print("Welcome to the Gemini Chatbot!")
    print("Type 'exit' to quit.")
    context = load_context("LLM_testing/nmap_vuln_data.json")

    while True:
        user_question = input("You: ")
        if user_question.lower() == 'exit':
            break
        full_prompt = f"""Here are the scan results from an Nmap scan:

                       {context}

                        Question: {user_question}
                         Answer based on the above data.
                         """
        print(f"Prompt: {full_prompt}")
        model_response = get_gemini_response(full_prompt)
        print(f"Gemini: {model_response}")