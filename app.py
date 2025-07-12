from flask import Flask
from Backend.routes.parser_endpoint import parse_bp

app = Flask(__name__)
app.register_blueprint(parse_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
