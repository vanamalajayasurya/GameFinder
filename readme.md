# 🎮 GameFinder

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&size=28&duration=3000&pause=1000&color=00F5FF&center=true&vCenter=true&width=900&lines=Discover+50%2C000%2B+Games;Search+%7C+Ratings+%7C+Trailers+%7C+Screenshots;Powered+by+RAWG+API+%26+Flask" alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Flask-Backend-black?style=for-the-badge&logo=flask"/>
  <img src="https://img.shields.io/badge/JavaScript-Frontend-yellow?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel"/>
  <img src="https://img.shields.io/badge/RAWG-Game%20API-green?style=for-the-badge"/>
</p>

<p align="center">
  <img src="https://media.tenor.com/qJ5evVs-_uUAAAAd/cyberpunk-edgerunners.gif" width="100%">
</p>

---

## 🌐 Live Demo

> Replace with your deployed Vercel URL.

* **Live Website:** https://gamefinder-beta.vercel.app/
* **GitHub Repository:** https://github.com/vanamalajayasurya/GameFinder

---

## 📖 About GameFinder

**GameFinder** is a modern game discovery web application that helps users search and explore thousands of games using the **RAWG Video Games Database API**.

It provides game ratings, Metacritic scores, screenshots, trailers, release dates, genres, and platform availability in a clean gaming-inspired interface.

---

## ✨ Features

* 🔍 Instant game search.
* ⭐ Trending games section.
* 🏆 Top-rated games.
* 🆕 Latest game releases.
* 🎮 Filter by gaming platform.
* 📊 RAWG & Metacritic ratings.
* 📅 Release dates.
* 🖼 HD screenshots gallery.
* ▶ Official trailers.
* 🌙 Dark / Light mode.
* 📱 Responsive design.

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)

### Backend

* Python
* Flask
* Flask-CORS
* Requests

### API

* RAWG Video Games Database API

### Deployment

* Vercel

---

## 🎮 Supported Platforms

* 💻 PC
* 🎮 PlayStation
* 🟢 Xbox
* 🔴 Nintendo Switch
* 📱 Android
* 🍎 iOS

---

## 📂 Project Structure

```text
GameFinder/
│
├── api/
│   └── app.py              # Flask API Backend
│
├── index.html              # Homepage
├── style.css               # Styling
├── script.js               # Frontend Logic
├── requirements.txt         # Python Dependencies
├── vercel.json             # Vercel Configuration
└── README.md               # Documentation
```

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/vanamalajayasurya/GameFinder.git
cd GameFinder
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Backend

```bash
python api/app.py
```

Runs locally on:

```text
http://127.0.0.1:5000
```

### 4. Run Frontend

Open **index.html** using Live Server or any static server.

---

## 🌐 API Endpoints

| Endpoint            | Description         |
| ------------------- | ------------------- |
| `/games`            | Search games        |
| `/game/<id>`        | Game details        |
| `/trending`         | Trending games      |
| `/top-rated`        | Highest-rated games |
| `/new-releases`     | Latest releases     |
| `/screenshots/<id>` | Game screenshots    |
| `/trailers/<id>`    | Official trailers   |

---

## 📸 Project Preview

> Add screenshots inside a `screenshots/` folder.

```text
screenshots/
├── home.png
├── search.png
├── details.png
├── trailer.png
└── mobile.png
```

Example in README:

```md
## Home Page

![Home](screenshots/home.png)

## Game Details

![Details](screenshots/details.png)
```

---

## ⚙️ Deployment on Vercel

1. Push project to GitHub.
2. Import repository into Vercel.
3. Vercel detects:

   * Static frontend files.
   * Flask backend inside `api/app.py`.
4. Deploy the project.

---

## 💡 Future Improvements

* ❤️ Wishlist.
* 🔄 Compare games.
* 👤 User authentication.
* 📈 Personalized recommendations.
* 🎯 Favorite games collection.

---

## 👨‍💻 Author

**Vanamala Jayasurya**

B.Tech — Computer Science & Engineering (Data Science)

* GitHub: https://github.com/vanamalajayasurya
* LinkedIn: *Add your LinkedIn profile here.*

---

## ⭐ Show Your Support

If you like this project, give it a **⭐ Star** on GitHub.

<p align="center">
  Made with ❤️ by <b>Vanamala Jayasurya</b>
</p>
