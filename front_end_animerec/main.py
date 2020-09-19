from requests import get, post
from flask import Flask, render_template


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

if __name__ == "__main__":
    app.run(debug=True)
