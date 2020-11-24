# Anime Recommendation System

## Homepage

Visit the live site here: http://3.131.210.47:5000/

![Our Cycle 1 Homepage](./management/images/sprint1_homepage.png)

## Installation
1. Clone this git repo (including the backend system submodule):
    - `git clone --recurse-submodules -j8 https://github.com/chriskok/AnimeRec.git`
2. Make sure all the necessary files are downloaded in the anime-recommendation-system submodule (google drive link: TBD)
3. If running on your local system (instead of using Docker), install requirements (in requirements.txt) for both front end and back end systems

## Usage
### Run with Docker
1. Install docker and docker-compose on your system
2. Run `docker-compose up -d` to bring the system up (may take a while to build at first - once built, it's a quick boot up)
3. To close, run `docker-compose down`

### Run on Local System
1. Start the front end webserver
    - `cd front_end_animerec`
    - `python main.py`
    - Access the app on your browser at http://0.0.0.0:5000/
    - NOTE: It's currently using the live API hosted in EC2 instead of the API on a local system. To change this, you can change the `API_URL` variable in front_end_animerec/main.py to http://0.0.0.0:8000/
2. Start the API (if necessary, use a different terminal)
    - `cd anime-recommendation-system`
    - `uvicorn main:api --reload`