from requests import get, post
from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

#Url that points to where the api is running on
API_URL = "http://127.0.0.1:8000"

@app.route("/", methods=["GET"])
def main():
    return render_template("./index.html")


@app.route("/get-names", methods=["GET"])
def get_names():
    response = get(url=f"{API_URL}/api/v1/get_names")
    if response.status_code == 200:        
        return response.content
    return {"names": []}

@app.route("/get-recommendations/<string:anime_name>", methods=["POST"])
def get_recommendations(anime_name: str):
    response = get(
        url=f"{API_URL}/api/v1/get_recommendations?anime_names={anime_name.replace(' ', '%20')}")

    if response.status_code == 200:        
        return response.content
    return {}

@app.route('/js/<path:filename>')
def serve_static_js(filename):
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join(root_dir, 'front_end_animerec', 'static', 'js'), filename)

@app.route('/css/<path:filename>')
def serve_static_css(filename):
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join(root_dir, 'front_end_animerec', 'static', 'css'), filename)

if __name__ == "__main__":
    app.run(debug=True)
