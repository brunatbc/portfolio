const LASTFM_USERNAME = "brunatbc";
const LASTFM_API_KEY = "b1560a0937851530be48a14d2455b612";
const POLL_MS = 30000;

async function updateLastFM() {
  const card = document.getElementById("lastfm-card");
  const title = document.getElementById("track-name");
  const artist = document.getElementById("artist-name");
  const status = document.getElementById("track-status");
  const art = document.getElementById("album-art");

  if (!card || !title || !artist || !status || !art) return;

  const language = window.currentLanguage || "pt";

  if (
    LASTFM_USERNAME === "SEU_USUARIO_LASTFM" ||
    LASTFM_API_KEY === "SUA_API_KEY"
  ) {
    title.textContent =
      language === "pt" ? "adicione seus dados" : "add your details";
    artist.textContent = "Last.fm";
    status.textContent =
      language === "pt" ? "aguardando configuração" : "waiting for setup";
    return;
  }

  try {
    const url = new URL("https://ws.audioscrobbler.com/2.0/");
    url.search = new URLSearchParams({
      method: "user.getRecentTracks",
      user: LASTFM_USERNAME,
      api_key: LASTFM_API_KEY,
      format: "json",
      limit: "1",
    });

    const response = await fetch(url);
    if (!response.ok) throw new Error("Last.fm request failed");

    const data = await response.json();
    const track = data?.recenttracks?.track?.[0];

    if (!track) throw new Error("No track");

    title.textContent =
      track.name || (language === "pt" ? "sem título" : "untitled");

    artist.textContent =
      track.artist?.["#text"] || (language === "pt" ? "artista" : "artist");

    const image =
      track.image?.find((item) => item.size === "extralarge")?.["#text"] || "";

    if (image) {
      art.style.backgroundImage = `url("${image}")`;
      art.classList.add("has-art");
      art.innerHTML = "";
    } else {
      art.style.backgroundImage = "";
      art.classList.remove("has-art");
      art.innerHTML = "<span>♪</span>";
    }

    const nowPlaying = track["@attr"]?.nowplaying === "true";

    status.textContent = nowPlaying
      ? language === "pt"
        ? "tocando agora"
        : "now playing"
      : language === "pt"
        ? "ouvida recentemente"
        : "last played";

    card.classList.toggle("is-playing", nowPlaying);
  } catch (error) {
    title.textContent =
      language === "pt" ? "não consegui buscar" : "couldn't fetch track";
    artist.textContent = "Last.fm";
    status.textContent =
      language === "pt" ? "verifique a configuração" : "check your setup";
  }
}

window.updateLastFM = updateLastFM;
