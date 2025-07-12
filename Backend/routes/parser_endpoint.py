# routes/parser_endpoint.py
from flask import Blueprint, request, jsonify
import os
from Backend.parser.nmap_parser import parse_nmap_xml
from Backend.LLM_Integration.llm_endpoint import llm_response

parse_bp = Blueprint("parse", __name__)


@parse_bp.route("/analyze-nmap", methods=["POST"])
def analyze_nmap():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    temp_path = f"/tmp/{file.filename}"
    file.save(temp_path)

    try:
        parsed = parse_nmap_xml(temp_path)
        analysis = analyze(parsed)
        return jsonify({"parsed_data": parsed, "analysis": analysis})

    finally:
        os.remove(temp_path)
