// ===============================
// GAME FINDER - Fixed script.js
// ===============================

// Works on localhost and Vercel
const API =
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000"
    : "";

const searchInput = document.getElementById("search-input");
const resultsGrid = document.getElementById("results-grid");
const resultsSection = document.getElementById("results-section");
const browseSection = document.getElementById("browse-section");

const trendingRow = document.getElementById("trending-row");
const topRatedGrid = document.getElementById("toprated-grid");
const newReleaseGrid = document.getElementById("newreleases-grid");

const platformFilter = document.getElementById("f-platform");
const ratingFilter = document.getElementById("f-rating");
const orderFilter = document.getElementById("f-order");

const drawer = document.getElementById("drawer");
const drawerBackdrop = document.getElementById("drawer-backdrop");
const drawerContent = document.getElementById("drawer-content");

// ---------- API ----------
async function getGames(search = "") {
    let url = `${API}/games?search=${encodeURIComponent(search)}&ordering=${orderFilter.value}&rating=${ratingFilter.value}`;
    if (platformFilter.value) url += `&platforms=${platformFilter.value}`;

   try {
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
} catch (err) {
    console.error("API Error:", err);
    return [];
}
}

// ---------- Platform Helper ----------
function platformNames(platforms = []) {
    return platforms.map((p) => {
        if (typeof p === "string") return p;
        return p.platform?.name || "";
    }).filter(Boolean);
}

// ---------- Game Card ----------
function gameCard(game) {

         const image =
        game.background_image ||
        "https://placehold.co/600x338/111827/FFFFFF?text=No+Image";

    const platforms = platformNames(game.platforms);

    return `
        <div class="card" onclick="openGame(${game.id})">
            <div class="card__media">
           <img
                src="${image}"
                alt="${game.name}"
                loading="lazy"
                onerror="this.onerror=null;
                this.src='https://placehold.co/600x338/111827/FFFFFF?text=No+Image';">

                <div class="card__rating">⭐ ${game.rating || "N/A"}</div>
            </div>

            <div class="card__body">
                <h3 class="card__title">${game.name}</h3>

                <div class="card__meta">
                    ${game.released || "Coming Soon"}
                </div>

                <div class="card__platforms">
                    ${platforms.slice(0,4).map(p =>
                        `<span class="platform-badge">${p}</span>`
                    ).join("")}
                </div>
            </div>
        </div>`;
}


// ---------- Search ----------
async function searchGames() {

    let text = searchInput.value.trim().toLowerCase();

    if (!text) {
        resultsSection.hidden = true;
        browseSection.hidden = false;
        return;
    }

    const aliases = {
        "gta 6": "Grand Theft Auto VI",
        "gta vi": "Grand Theft Auto VI",
        "rdr2": "Red Dead Redemption 2",
        "gow": "God of War",
        "spiderman 2": "Marvel's Spider-Man 2",
        "spider man 2": "Marvel's Spider-Man 2"
    };

    text = aliases[text] || text;

    const games = await getGames(text);

    browseSection.hidden = true;
    resultsSection.hidden = false;

        resultsGrid.innerHTML = games.map(gameCard).join("");

        const empty = document.getElementById("results-empty");
        if (empty) {
            empty.hidden = games.length !== 0;
        }
} // <-- Function ends here

// Search when Enter is pressed
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchGames();
    }
});


// ---------- Home ----------
async function loadHome() {
  try {
    const [trendingRes, topRatedRes, newReleasesRes] = await Promise.all([
      fetch(`${API}/trending`),
      fetch(`${API}/top-rated`),
      fetch(`${API}/new-releases`)
    ]);

    const trending = trendingRes.ok ? await trendingRes.json() : [];
    const topRated = topRatedRes.ok ? await topRatedRes.json() : [];
    const newReleases = newReleasesRes.ok ? await newReleasesRes.json() : [];

    trendingRow.innerHTML = trending.map(gameCard).join("");
    topRatedGrid.innerHTML = topRated.map(gameCard).join("");
    newReleaseGrid.innerHTML = newReleases.map(gameCard).join("");

  } catch (err) {
    console.error("Home API Error:", err);

    trendingRow.innerHTML = "<p>Unable to load games.</p>";
    topRatedGrid.innerHTML = "<p>Unable to load games.</p>";
    newReleaseGrid.innerHTML = "<p>Unable to load games.</p>";
  }
}

// ---------- Drawer ----------
// ---------- Drawer ----------
async function openGame(id) {

 try {
        drawer.hidden = false;
        drawerBackdrop.hidden = false;

        drawerContent.innerHTML = "<p style='padding:20px'>Loading...</p>";

const [gameRes, shotsRes, trailersRes] = await Promise.all([
  fetch(`${API}/game/${id}`),
  fetch(`${API}/screenshots/${id}`),
  fetch(`${API}/trailers/${id}`)
]);

if (!gameRes.ok) throw new Error("Game API failed");

const game = await gameRes.json();
const shots = shotsRes.ok ? await shotsRes.json() : [];
const trailers = trailersRes.ok ? await trailersRes.json() : [];

    const image =
        game.background_image ||
        "https://placehold.co/900x500/111827/FFFFFF?text=No+Image";

    const platforms = platformNames(game.platforms);

    drawerContent.innerHTML = `
        <div class="detail__hero">
            <img
                src="${image}"
                alt="${game.name}"
                loading="lazy"
                onerror="this.onerror=null; this.src='https://placehold.co/900x500/111827/FFFFFF?text=No+Image';">
        </div>

        <h1 class="detail__title">${game.name}</h1>

        <div class="detail__meta-row">
            ⭐ ${game.rating || "N/A"} •
            Metacritic ${game.metacritic || "N/A"} •
            ${game.released || "Coming Soon"}
        </div>

            <p class="detail__desc">
            ${game.description || game.description_raw || "No description available."}
            </p>

        <h3 class="detail__section-title">Platforms</h3>

        <div class="detail__platforms">
            ${platforms.map(p =>
                `<span class="platform-badge">${p}</span>`
            ).join("")}
        </div>

        <h3 class="detail__section-title">Screenshots</h3>

        <div class="screens">
            ${shots.slice(0,6).map(img => `
                <img
                    src="${img}"
                    loading="lazy"
                    onerror="this.style.display='none';">
            `).join("")}
        </div>

        <h3 class="detail__section-title">Official Trailer</h3>

        ${
            trailers.length
            ? (
                trailers[0].video
                ? `
                <div class="trailer-wrap">
                    <video controls width="100%" src="${trailers[0].video}"></video>
                </div>`
                : `
                <div class="trailer-wrap">
                    <a class="youtube-btn"
                       href="${trailers[0].youtube}"
                       target="_blank"
                       rel="noopener noreferrer">
                       ▶ Watch Official Trailer on YouTube
                    </a>
                </div>`
            )
            : `<p>No trailer available.</p>`
        }
    `;
    } catch (err) {
    console.error("Game Details Error:", err);

    drawerContent.innerHTML = `
      <div style="padding:24px;text-align:center;color:white;">
            <h2>⚠ Unable to load game details</h2>
            <p>Please try again later.</p>
        </div>
    `;
  }
}
    

// ---------- Close Drawer ----------
function closeDrawer(){
    drawer.hidden = true;
    drawerBackdrop.hidden = true;
}

drawerBackdrop.onclick = closeDrawer;
document.getElementById("drawer-close").onclick = closeDrawer;

// ---------- Theme ----------
const themeBtn = document.getElementById("theme-toggle");

themeBtn.onclick = () => {

    const html = document.documentElement;

    const next = html.dataset.theme === "dark"
        ? "light"
        : "dark";

    html.dataset.theme = next;
    localStorage.setItem("theme", next);
};

const savedTheme = localStorage.getItem("theme");

if(savedTheme){
    document.documentElement.dataset.theme = savedTheme;
}

// ---------- Reset ----------
document.getElementById("f-clear").onclick = () => {
    searchInput.value = "";
    platformFilter.value = "";
    ratingFilter.value = "0";
    orderFilter.value = "-added";

    resultsSection.hidden = true;
    browseSection.hidden = false;

    loadHome();
};

// ---------- Start ----------
loadHome();