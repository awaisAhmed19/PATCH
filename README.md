PATCH



For the LLM , we use Google's Gemini 2.5 Flash model which provides a 2.5 billion parameter model. We use the Gemini 2.5 Flash model because it offers free services with their API. So, dont forget to get you API key initially and set it as the environment variable using:
in Linux, use : export GEMINI_API_KEY='YOUR_API_KEY'
in Windows , use setx GEMINI_API_KEY <YOUR_API_KEY>.
and restart your terminal.

Don't forget to download the dependencies for the LLM, which is in the requirements_for_llm.txt

For the LLM, we don't just directly feed the josn data, we use RAG to enhance the data to a format, that a model like GEMINI can undertsand.
RAG stands for Retrieval-Augmented Generation. It’s a technique where a language model (like Gemini or GPT) is enhanced by providing it with external context, usually retrieved from structured or unstructured documents, so that:
1. The model doesn’t have to memorize all knowledge
2. Answers are more accurate, grounded in real data

We are using RAG to:
1. Receive a JSON file with structured Nmap vulnerability scan results
2. Extract relevant data (host IP, OS, services, vulnerabilities)
3. Build a prompt using that context + a default question
4. Send the prompt to Gemini and return the generated answer
This is a simple but effective RAG pipeline where the JSON serves as the retrieval knowledge base, and Gemini handles the generation.

The code for the llm's endpoint is located in 'llm_endpoint.py'