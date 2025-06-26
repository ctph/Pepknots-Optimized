from flask import Flask, send_from_directory, make_response
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/filtered_pdbs/*": {"origins": "*"}})  # Allow all origins (or specify your React URL)

PDB_DIR = os.path.join(os.path.dirname(__file__), 'filtered_pdbs')

@app.route('/filtered_pdbs/<path:filename>')
# def get_pdb_file(filename):
#     return send_from_directory(PDB_DIR, filename)
def get_pdb_file(filename):
    response = make_response(send_from_directory(PDB_DIR, filename))
    response.headers["Content-Disposition"] = f"inline; filename={filename}"
    return response

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))  # Render provides PORT
    app.run(host="0.0.0.0", port=port)
