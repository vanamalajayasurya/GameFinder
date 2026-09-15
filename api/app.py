from flask import Flask, request, jsonify, send_from_directory
from datetime import datetime, timedelta
from pathlib import Path
from requests.exceptions import RequestException
import requests

# ========================= CONFIG =========================
API_KEY = "28feeb10be4e42cab0e7e0f9d80b423a"
BASE_URL = "https://api.rawg.io/api"

ROOT = Path(__file__).resolve().parent.parent

app = Flask(
    __name__,
    static_folder=str(ROOT),
    static_url_path=""
)

# ========================= STATIC FILES =========================
@app.route("/")
def home():
    return send_from_directory(ROOT, "index.html")

@app.route("/script.js")
def script():
    return send_from_directory(ROOT, "script.js")

@app.route("/style.css")
def style():
    return send_from_directory(ROOT, "style.css")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(ROOT, path)

# ========================= HELPERS =========================
def format_game(game):
    return {
        "id": game["id"],
        "name": game["name"],
        "rating": game.get("rating", 0),
        "released": game.get("released"),
        "background_image": game.get("background_image"),
        "platforms": [
            p["platform"]["name"]
            for p in game.get("platforms", [])
        ]
    }

# ========================= SEARCH GAMES =========================
@app.route("/games")
def games():
    search = request.args.get("search", "").strip().lower()

    try:
        response = requests.get(
            f"{BASE_URL}/games",
            params={
                "key": API_KEY,
                "search": search,
                "search_precise": True,
                "page_size": 20
            },
            timeout=10
        )
        response.raise_for_status()
    except RequestException:
        return jsonify([])

    data = response.json()
    best_game = None

    for game in data.get("results", []):
        name = game.get("name", "").lower()

        if any(x in name for x in ["test", "demo", "prototype", "beta", "alpha"]):
            continue

        if not game.get("background_image"):
            continue

        if game.get("rating", 0) < 3.5:
            continue

        if name == search:
            best_game = game
            break

        if name.startswith(search) and best_game is None:
            best_game = game

    if best_game is None:
        for game in data.get("results", []):
            if game.get("background_image") and game.get("rating", 0) >= 3.5:
                best_game = game
                break

    if best_game is None:
        return jsonify([])

    return jsonify([format_game(best_game)])

# ========================= GAME DETAILS =========================
@app.route("/game/<int:game_id>")
def game_details(game_id):
    try:
        response = requests.get(
            f"{BASE_URL}/games/{game_id}",
            params={"key": API_KEY},
            timeout=10
        )
        response.raise_for_status()
    except RequestException:
        return jsonify({"message": "Game not found"}), 404

    game = response.json()

    return jsonify({
        "id": game["id"],
        "name": game["name"],
        "rating": game.get("rating"),
        "metacritic": game.get("metacritic"),
        "released": game.get("released"),
        "description": game.get("description_raw"),
        "background_image": game.get("background_image"),
        "platforms": [
            p["platform"]["name"]
            for p in game.get("platforms", [])
        ]
    })

# ========================= SCREENSHOTS =========================
@app.route("/screenshots/<int:game_id>")
def screenshots(game_id):
    try:
        response = requests.get(
            f"{BASE_URL}/games/{game_id}/screenshots",
            params={"key": API_KEY},
            timeout=10
        )
        response.raise_for_status()
    except RequestException:
        return jsonify([])

    data = response.json()

    return jsonify([
        shot["image"]
        for shot in data.get("results", [])
    ])

# ========================= TRAILERS =========================
@app.route("/trailers/<int:game_id>")
def trailers(game_id):
    try:
        response = requests.get(
            f"{BASE_URL}/games/{game_id}/movies",
            params={"key": API_KEY},
            timeout=10
        )
        response.raise_for_status()

        data = response.json()

        if data.get("results"):
            movie = data["results"][0]
            return jsonify([{
                "video": movie["data"].get("480"),
                "youtube": f"https://www.youtube.com/results?search_query={movie['name']} official trailer"
            }])
    except RequestException:
        pass

    try:
        game = requests.get(
            f"{BASE_URL}/games/{game_id}",
            params={"key": API_KEY},
            timeout=10
        ).json()

        game_name = game.get("name", "")
    except Exception:
        game_name = ""

    return jsonify([{
        "youtube": f"https://www.youtube.com/results?search_query={game_name}+official+game+trailer"
    }])

# ========================= HOME SECTIONS =========================
def get_home_games(order):
    try:
        response = requests.get(
            f"{BASE_URL}/games",
            params={
                "key": API_KEY,
                "ordering": order,
                "page_size": 40
            },
            timeout=10
        )
        response.raise_for_status()
    except RequestException:
        return jsonify([])

    data = response.json()
    games = []

    for game in data.get("results", []):
        if not game.get("background_image"):
            continue

        if game.get("rating", 0) <= 0:
            continue

        name = game.get("name", "").lower()
        if "test" in name or "demo" in name:
            continue

        games.append(format_game(game))

        if len(games) == 10:
            break

    return jsonify(games)

@app.route("/trending")
def trending():
    return get_home_games("-added")

@app.route("/top-rated")
def top_rated():
    return get_home_games("-rating")

@app.route("/new-releases")
def new_releases():
    today = datetime.today().date()
    last_year = today - timedelta(days=365)

    try:
        response = requests.get(
            f"{BASE_URL}/games",
            params={
                "key": API_KEY,
                "dates": f"{last_year},{today}",
                "ordering": "-released",
                "page_size": 20
            },
            timeout=10
        )
        response.raise_for_status()
    except RequestException:
        return jsonify([])

    data = response.json()
    games = []

    for game in data.get("results", []):
        if not game.get("background_image"):
            continue

        if game.get("rating", 0) <= 0:
            continue

        games.append(format_game(game))

        if len(games) == 10:
            break

    return jsonify(games)

# ========================= RUN =========================
if __name__ == "__main__":
    app.run(debug=True, port=5000)