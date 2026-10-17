import "./Flares.css";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";

const DAY = 24 * 60 * 60 * 1000;
const DURATION = 5000;

const R = 26;
const C = 2 * Math.PI * R;

const BGS = ["#000000", "#1a1a1a", "#ececec", "#ffffff"];

const isLight = (bg) => bg === "#ffffff" || bg === "#ececec";

const LANGS = ["JavaScript", "TypeScript", "Python", "Go", "CSS", "HTML"];

// ======================================================
// API
// ======================================================

const BACKEND_URL = "http://localhost:5000";
const API_BASE = `${BACKEND_URL}/api`;
const STORIES_URL = `${API_BASE}/stories`;
const MUSIC_API_URL = `${API_BASE}/music/search`;

const getMediaUrl = (url) => {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ======================================================
// SEEN STORIES (remembered per browser)
// ======================================================

const SEEN_KEY = "flares_seen_ids";

const loadSeen = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]"));
  } catch {
    return new Set();
  }
};

const saveSeen = (id) => {
  try {
    const set = loadSeen();
    set.add(id);
    // keep the list from growing forever
    localStorage.setItem(SEEN_KEY, JSON.stringify([...set].slice(-300)));
  } catch {
    /* storage unavailable */
  }
};

const ago = (ms) => {
  const m = Math.floor(ms / 60000);

  if (m < 1) return "now";

  if (m < 60) {
    return `${m}m`;
  }

  return `${Math.floor(m / 60)}h`;
};

// Works for both seed songs (src) and API songs (previewUrl)
const songSrc = (song) => song?.src || song?.previewUrl || "";

// ======================================================
// MAP DATABASE STORIES -> UI GROUPS
// ======================================================

const EMPTY_ME = {
  id: "me",
  mine: true,
  name: "Your status",
  initial: "U",
  items: [],
};

// One DB story -> one UI item
const mapStory = (s, seenSet) => ({
  id: s._id,
  type: s.type,
  text: s.text || "",
  code: s.code || "",
  lang: s.lang || "JavaScript",
  image: getMediaUrl(s.mediaUrl || ""),
  bg: s.background || "#000000",
  music: s.music?.id
    ? {
        ...s.music,
        duration: s.music.duration || "",
        art: "rings",
      }
    : null,
  musicPos: s.musicPos || { x: 7, y: 68 },
  musicStyle: s.musicStyle === "pill" ? "pill" : "full",
  musicRot: s.musicRot ?? 0,
  musicScale: s.musicScale ?? 1,
  createdAt: new Date(s.createdAt).getTime(),
  seen: s.isMine || seenSet.has(s._id),
});

// Flat story list from the API -> [{ me }, { friend }, ...]
const buildGroups = (stories) => {
  const seenSet = loadSeen();
  const me = { ...EMPTY_ME, items: [] };
  const friends = new Map();

  stories.forEach((s) => {
    const item = mapStory(s, seenSet);

    if (s.isMine) {
      me.items.push(item);
      return;
    }

    const uid = String(s.user?._id || s.user);
    const name = s.user?.name || s.user?.username || "User";

    if (!friends.has(uid)) {
      friends.set(uid, {
        id: uid,
        name,
        initial: name.charAt(0).toUpperCase(),
        items: [],
      });
    }

    friends.get(uid).items.push(item);
  });

  return [me, ...friends.values()];
};

// ======================================================
// RING
// ======================================================

function Ring({ items, initial }) {
  const n = items.length;

  const gap = n > 1 ? 5 : 0;

  const seg = n ? C / n - gap : 0;

  return (
    <svg viewBox="0 0 60 60" width="58" height="58" aria-hidden="true">
      {n === 0 ? (
        <circle cx="30" cy="30" r={R} className="st-ring-empty" />
      ) : (
        items.map((it, i) => (
          <circle
            key={it.id}
            cx="30"
            cy="30"
            r={R}
            className={it.seen ? "st-seg seen" : "st-seg"}
            strokeDasharray={`${seg} ${C}`}
            transform={`rotate(${-90 + (i * 360) / n + (gap / C) * 180} 30 30)`}
          />
        ))
      )}

      {items.some((i) => !i.seen) && (
        <g className="st-sat">
          <circle cx="30" cy="4" r="2.2" />
        </g>
      )}

      <circle cx="30" cy="30" r="21" className="st-core" />

      <text x="30" y="34" textAnchor="middle" className="st-initial">
        {initial}
      </text>
    </svg>
  );
}

// ======================================================
// BACKGROUND
// ======================================================

function Aurora() {
  return <div className="st-orbits" aria-hidden="true" />;
}

function Art({ kind }) {
  switch (kind) {
    case "stripes":
      return (
        <>
          <rect width="100" height="100" fill="#f4f4f4" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <line
              key={i}
              x1={i * 20 - 40}
              y1="100"
              x2={i * 20 + 60}
              y2="0"
              stroke="#000"
              strokeWidth="7"
            />
          ))}
          <circle cx="50" cy="50" r="17" fill="#000" />
          <circle cx="50" cy="50" r="5" fill="#f4f4f4" />
        </>
      );

    case "grid":
      return (
        <>
          <rect width="100" height="100" fill="#151515" />
          {Array.from({ length: 36 }, (_, n) => {
            const x = 12 + (n % 6) * 15.2;
            const y = 12 + Math.floor(n / 6) * 15.2;
            const d = Math.hypot(x - 50, y - 50);
            return (
              <circle
                key={n}
                cx={x}
                cy={y}
                r={1 + 4.2 * Math.max(0, 1 - d / 62)}
                fill="#fff"
              />
            );
          })}
        </>
      );

    case "wave":
      return (
        <>
          <rect width="100" height="100" fill="#fff" />
          {[24, 40, 56, 72].map((y, i) => (
            <path
              key={y}
              d={`M-5 ${y} C 20 ${y - 18}, 30 ${y + 18}, 52 ${y} S 85 ${y - 18}, 105 ${y}`}
              fill="none"
              stroke="#000"
              strokeWidth="3.2"
              strokeOpacity={1 - i * 0.2}
            />
          ))}
        </>
      );

    case "orb":
      return (
        <>
          <rect width="100" height="100" fill="#000" />
          <circle cx="50" cy="50" r="31" fill="#fff" />
          <circle cx="63" cy="42" r="27" fill="#000" />
          <circle cx="80" cy="20" r="3" fill="#fff" />
          <circle cx="18" cy="80" r="1.8" fill="#fff" fillOpacity=".7" />
        </>
      );

    default:
      return (
        <>
          <rect width="100" height="100" fill="#0a0a0a" />
          {[44, 36, 28, 20, 12, 5].map((r, i) => (
            <circle
              key={r}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="#fff"
              strokeOpacity={0.9 - i * 0.14}
              strokeWidth="1.6"
            />
          ))}
        </>
      );
  }
}

function Cover({ song, size = 56 }) {
  return (
    <span
      className="st-cover"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {song.cover ? (
        <img src={song.cover} alt="" loading="lazy" />
      ) : (
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <Art kind={song.art} />
        </svg>
      )}
    </span>
  );
}

// ======================================================
// MUSIC CARD (selected song in composer / viewer)
// ======================================================

function SongCard({
  song,
  progress,
  onClick,
  onRemove,
  playing = false,
  variant = "full",
}) {
  return (
    <div
      className={`st-song-card ${playing ? "is-playing" : ""} ${
        variant === "pill" ? "pill" : ""
      }`}
    >
      <button
        type="button"
        className="st-song-card-main"
        onClick={onClick}
        disabled={!onClick}
      >
        <Cover song={song} size={variant === "pill" ? 30 : 52} />

        <div className="st-song-details">
          <strong>{song.title}</strong>
          <span>{song.artist}</span>

          <div className="st-song-meta">
            <span className="st-music-badge">MUSIC</span>
            {song.duration && <span>{song.duration}</span>}
          </div>
        </div>

        <div className={`st-equalizer ${playing ? "active" : ""}`}>
          <i />
          <i />
          <i />
          <i />
        </div>
      </button>

      {onRemove && (
        <button
          type="button"
          className="st-song-remove"
          onClick={onRemove}
          aria-label="Remove selected music"
        >
          <CloseRoundedIcon />
        </button>
      )}

      {typeof progress === "number" && (
        <div className="st-song-progress">
          <span style={{ width: `${progress * 100}%` }} />
        </div>
      )}
    </div>
  );
}

// ======================================================
// MUSIC PICKER — opens as a full story-style overlay
// ======================================================

function formatDuration(milliseconds) {
  if (!milliseconds) return "--:--";

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function MusicPicker({ open, selected, onPick, onClose }) {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSong, setActiveSong] = useState(null);
  const [previewMessage, setPreviewMessage] = useState("");

  const audioRef = useRef(null);

  // Reset the search when the picker closes.
  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveSong(null);
      setPreviewMessage("");
    }
  }, [open]);

  // Fetch songs from our DevOrbit backend.
  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();

    // Debounce typing so we don't send a request for every keystroke.
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        const searchTerm = query.trim();

        if (searchTerm) {
          params.set("q", searchTerm);
        }

        const suffix = params.toString() ? `?${params.toString()}` : "";

        const response = await fetch(`${MUSIC_API_URL}${suffix}`, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load music.");
        }
        console.log("Published story from backend:", data.story);
        console.log("Photo URL:", getMediaUrl(data.story?.mediaUrl));

        const formattedSongs = (data.songs || []).map((track) => ({
          id: String(track.id),
          title: track.title,
          artist: track.artist,
          album: track.album || "",
          cover: track.artwork || "",
          previewUrl: track.previewUrl || null,
          src: track.previewUrl || "",
          musicUrl: track.musicUrl || "",
          duration: formatDuration(track.duration),
          art: "rings",
        }));

        setSongs(formattedSongs);
      } catch (err) {
        if (err.name !== "AbortError") {
          setSongs([]);
          setError(err.message || "Unable to connect to the music API.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [open, query]);

  if (!open) return null;

  const q = query.trim().toLowerCase();

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(q) ||
      song.artist.toLowerCase().includes(q),
  );

  const toggleActive = async (song) => {
    const audio = audioRef.current;

    if (!audio) {
      setPreviewMessage("Audio player is not available.");
      return;
    }

    setPreviewMessage("");

    // Pause the currently playing song when its button is clicked.
    if (activeSong === song.id && !audio.paused) {
      audio.pause();
      setActiveSong(null);
      return;
    }

    const url = songSrc(song);

    // Not every track has a preview.
    if (!url) {
      audio.pause();
      audio.removeAttribute("src");
      setActiveSong(null);
      setPreviewMessage("No audio preview is available for this song.");
      return;
    }

    try {
      audio.pause();

      audio.src = url;
      audio.load();

      setActiveSong(song.id);

      await audio.play();
    } catch (error) {
      console.error("Audio preview error:", error);

      setActiveSong(null);
      setPreviewMessage(
        "Could not play this song preview. Please try another song.",
      );
    }
  };

  const choose = (song) => {
    onPick(song);
    onClose();
  };

  return createPortal(
    <div
      className="st-overlay st-music-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Choose music"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="st-music-picker">
        <audio
          ref={audioRef}
          preload="none"
          onPlay={() => {
            setPreviewMessage("");
          }}
          onEnded={() => {
            setActiveSong(null);
          }}
          onError={(event) => {
            const audio = event.currentTarget;

            // Ignore the "error" fired by removeAttribute("src")
            if (!audio.getAttribute("src")) return;

            console.error("Audio element error:", {
              code: audio.error?.code,
              message: audio.error?.message,
              source: audio.currentSrc,
            });

            setActiveSong(null);
            setPreviewMessage(
              "The audio file could not be loaded. Try another song or check the Console.",
            );
          }}
        />

        <header className="st-music-picker-head">
          <div>
            <span className="st-music-eyebrow">SOUNDTRACK</span>
            <h3>Add music</h3>
            <p>Pick a sound for your story</p>
          </div>

          <button
            type="button"
            className="st-music-picker-close"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseRoundedIcon />
          </button>
        </header>

        <div className="st-music-search">
          <SearchRoundedIcon />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs or artists"
            autoComplete="off"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <CloseRoundedIcon />
            </button>
          )}
        </div>

        {selected && (
          <div className="st-music-selected">
            <span className="st-music-selected-label">SELECTED</span>

            <SongCard
              song={selected}
              playing={activeSong === selected.id}
              onClick={() => toggleActive(selected)}
              onRemove={() => onPick(null)}
            />
          </div>
        )}

        <div className="st-music-list-heading">
          <strong>{query ? "Results" : "Discover"}</strong>
          <span>
            {loading ? "Searching..." : `${filteredSongs.length} tracks`}
          </span>
        </div>

        <div className="st-music-list">
          {loading ? (
            <div className="st-music-empty">
              <MusicNoteRoundedIcon />
              <strong>Finding songs...</strong>
              <span>Searching the music catalog.</span>
            </div>
          ) : error ? (
            <div className="st-music-empty">
              <MusicNoteRoundedIcon />
              <strong>Couldn't load music</strong>
              <span>{error}</span>
              <button type="button" onClick={() => setQuery((value) => value)}>
                Try again by editing your search
              </button>
            </div>
          ) : filteredSongs.length > 0 ? (
            filteredSongs.map((song, index) => {
              const isSelected = selected?.id === song.id;
              const isActive = activeSong === song.id;

              return (
                <div
                  key={song.id}
                  className={`st-music-track ${
                    isSelected ? "selected" : ""
                  } ${isActive ? "active" : ""}`}
                  style={{ "--i": index }}
                >
                  <button
                    type="button"
                    className="st-track-preview"
                    onClick={() => toggleActive(song)}
                    aria-label={`${
                      isActive ? "Pause" : "Preview"
                    } ${song.title}`}
                  >
                    <span className="st-track-art">
                      <Cover song={song} size={56} />

                      <span className="st-track-play">
                        {isActive ? (
                          <PauseRoundedIcon />
                        ) : (
                          <PlayArrowRoundedIcon />
                        )}
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    className="st-track-info"
                    onClick={() => choose(song)}
                  >
                    <strong>{song.title}</strong>
                    <span>{song.artist}</span>
                  </button>

                  <div className="st-track-wave" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>

                  <time className="st-track-time">{song.duration}</time>

                  <button
                    type="button"
                    className={`st-track-add ${isSelected ? "selected" : ""}`}
                    onClick={() => choose(song)}
                    aria-label={`Select ${song.title}`}
                  >
                    {isSelected ? <CheckRoundedIcon /> : <AddRoundedIcon />}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="st-music-empty">
              <MusicNoteRoundedIcon />
              <strong>No tracks found</strong>
              <span>Try another song or artist.</span>
            </div>
          )}
        </div>

        {previewMessage && (
          <p role="status" className="st-music-preview-message">
            {previewMessage}
          </p>
        )}

        <footer className="st-music-picker-footer">
          <span>
            <MusicNoteRoundedIcon />
            {selected
              ? `${selected.title} · ${selected.artist}`
              : "No song selected"}
          </span>

          <button type="button" onClick={onClose}>
            Done
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}

// ======================================================
// DRAGGABLE — move, rotate and resize the song card
//  • 1 finger / mouse: drag
//  • 2 fingers: pinch to resize, twist to rotate
//  • corner handle: drag to rotate + resize (mouse friendly)
//  • double-click the handle: reset
// ======================================================

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

// Snap to 0° when close, like Instagram's level guide
const snapAngle = (deg) => {
  const n = ((((deg + 180) % 360) + 360) % 360) - 180;
  return Math.abs(n) < 4 ? 0 : n;
};

function Draggable({
  pos,
  rotation = 0,
  scale = 1,
  onChange,
  variant = "full",
  children,
}) {
  const el = useRef(null);
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const handle = useRef(null);
  const moved = useRef(false);
  const [active, setActive] = useState(false);

  const startDrag = (pt) => {
    const box = el.current.offsetParent.getBoundingClientRect();

    gesture.current = {
      mode: "drag",
      px: pt.x,
      py: pt.y,
      x: pos.x,
      y: pos.y,
      box,
    };
  };

  const startPinch = () => {
    const [a, b] = [...pointers.current.values()];

    gesture.current = {
      mode: "pinch",
      dist: Math.hypot(b.x - a.x, b.y - a.y) || 1,
      angle: Math.atan2(b.y - a.y, b.x - a.x),
      rotation,
      scale,
    };

    moved.current = true;
    setActive(true);

    pointers.current.forEach((_, id) => {
      try {
        el.current.setPointerCapture(id);
      } catch {
        /* pointer already gone */
      }
    });
  };

  const down = (e) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 1) {
      moved.current = false;
      startDrag({ x: e.clientX, y: e.clientY });
    } else if (pointers.current.size === 2) {
      startPinch();
    }
  };

  const move = (e) => {
    if (!pointers.current.has(e.pointerId)) return;

    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const g = gesture.current;

    if (!g) return;

    // ---------- two fingers: rotate + resize ----------
    if (g.mode === "pinch" && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];

      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      const angle = Math.atan2(b.y - a.y, b.x - a.x);

      onChange({
        musicRot: snapAngle(g.rotation + ((angle - g.angle) * 180) / Math.PI),
        musicScale: clamp((g.scale * dist) / g.dist, MIN_SCALE, MAX_SCALE),
      });

      return;
    }

    if (g.mode !== "drag") return;

    // ---------- one pointer: drag ----------
    const dx = e.clientX - g.px;
    const dy = e.clientY - g.py;

    if (!moved.current && Math.abs(dx) + Math.abs(dy) > 4) {
      moved.current = true;
      setActive(true);

      // capture only once a real drag starts, so normal taps still work
      el.current.setPointerCapture(e.pointerId);
    }

    if (!moved.current) return;

    const w = (el.current.offsetWidth / g.box.width) * 100;
    const h = (el.current.offsetHeight / g.box.height) * 100;

    // keep the card's CENTER inside the story (works with rotate/scale)
    const cx = clamp(g.x + w / 2 + (dx / g.box.width) * 100, 6, 94);
    const cy = clamp(g.y + h / 2 + (dy / g.box.height) * 100, 6, 94);

    onChange({ musicPos: { x: cx - w / 2, y: cy - h / 2 } });
  };

  const up = (e) => {
    pointers.current.delete(e.pointerId);

    if (pointers.current.size === 1) {
      // one finger lifted: keep dragging with the other one
      startDrag([...pointers.current.values()][0]);
      return;
    }

    if (pointers.current.size === 0) {
      gesture.current = null;
      setActive(false);

      // keep "moved" until the click event has passed
      setTimeout(() => {
        moved.current = false;
      }, 0);
    }
  };

  // ---------- corner handle ----------

  const handleDown = (e) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

    const r = el.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    handle.current = {
      cx,
      cy,
      angle: Math.atan2(e.clientY - cy, e.clientX - cx),
      dist: Math.hypot(e.clientX - cx, e.clientY - cy) || 1,
      rotation,
      scale,
    };

    setActive(true);
  };

  const handleMove = (e) => {
    const h = handle.current;

    if (!h) return;

    e.stopPropagation();

    const angle = Math.atan2(e.clientY - h.cy, e.clientX - h.cx);
    const dist = Math.hypot(e.clientX - h.cx, e.clientY - h.cy);

    onChange({
      musicRot: snapAngle(h.rotation + ((angle - h.angle) * 180) / Math.PI),
      musicScale: clamp((h.scale * dist) / h.dist, MIN_SCALE, MAX_SCALE),
    });
  };

  const handleUp = (e) => {
    e.stopPropagation();
    handle.current = null;
    setActive(false);
  };

  return (
    <div
      ref={el}
      className={`st-song-slot drag ${variant === "pill" ? "pill" : ""} ${
        active ? "dragging" : ""
      }`}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: `rotate(${rotation}deg) scale(${scale})`,
      }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onClickCapture={(e) => {
        if (moved.current) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    >
      {children}

      <button
        type="button"
        className="st-song-rotate"
        aria-label="Rotate and resize (double-click to reset)"
        title="Drag to rotate and resize. Double-click to reset."
        style={{ transform: `rotate(${-rotation}deg) scale(${1 / scale})` }}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onChange({ musicRot: 0, musicScale: 1 });
        }}
      >
        <RotateRightRoundedIcon />
      </button>
    </div>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function Flares({ displayName = "", userInitial = "U" }) {
  const [groups, setGroups] = useState([EMPTY_ME]);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [storiesError, setStoriesError] = useState("");

  const [now, setNow] = useState(Date.now());

  const [viewer, setViewer] = useState(null);

  const [progress, setProgress] = useState(0);

  const [paused, setPaused] = useState(false);

  const [composer, setComposer] = useState(null);

  const [musicSheet, setMusicSheet] = useState(false);

  const [reply, setReply] = useState("");

  const [sent, setSent] = useState(false);

  const [posting, setPosting] = useState(false);

  const handlers = useRef({});

  const holdStart = useRef(0);

  // Audio player for the story viewer
  const viewerAudioRef = useRef(null);

  // ====================================================
  // CLOCK
  // ====================================================

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(id);
  }, []);

  // ====================================================
  // LOAD STORIES FROM THE DATABASE
  // ====================================================

  useEffect(() => {
    const controller = new AbortController();

    const loadStories = async () => {
      const token = getToken();

      if (!token) {
        setStoriesLoading(false);
        return;
      }

      setStoriesLoading(true);
      setStoriesError("");

      try {
        const response = await fetch(STORIES_URL, {
          headers: authHeaders(),
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Could not load stories.");
        }

        console.log("Stories received from backend:", data.stories);

        setGroups(buildGroups(data.stories || []));
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Load stories error:", err);
          setStoriesError(err.message || "Could not load stories.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setStoriesLoading(false);
        }
      }
    };

    loadStories();

    return () => controller.abort();
  }, []);

  // ====================================================
  // DATA
  // ====================================================

  const live = groups.map((g) => ({
    ...g,

    name: g.mine ? "Your story" : g.name,

    initial: g.mine ? userInitial : g.initial,

    items: g.items.filter((i) => now - i.createdAt < DAY),
  }));

  const me = live.find((g) => g.mine) || { ...EMPTY_ME, items: [] };

  const hasUnseen = (g) => g.items.some((i) => !i.seen);

  const friends = live
    .filter((g) => !g.mine && g.items.length)
    .sort((a, b) => Number(hasUnseen(b)) - Number(hasUnseen(a)));

  const vg = viewer ? live.find((g) => g.id === viewer.gid) : null;

  const item = vg ? vg.items[viewer.idx] : null;

  // Source of the song attached to the story currently being viewed
  const viewerMusicSrc = songSrc(item?.music);

  // ====================================================
  // VIEWER
  // ====================================================

  const resetPlay = () => {
    setProgress(0);
    setReply("");
    setSent(false);
  };

  const openViewer = (g) => {
    if (!g.items.length) return;

    const order = [me, ...friends]
      .filter((x) => x.items.length)
      .map((x) => x.id);

    const firstUnseen = g.items.findIndex((i) => !i.seen);

    setViewer({
      gid: g.id,
      idx: firstUnseen === -1 ? 0 : firstUnseen,
      order,
    });

    resetPlay();
  };

  const closeViewer = () => {
    setViewer(null);
    setPaused(false);
    resetPlay();
  };

  const goNext = () => {
    if (!vg) return;

    if (viewer.idx < vg.items.length - 1) {
      setViewer({
        ...viewer,
        idx: viewer.idx + 1,
      });
    } else {
      const nextId = viewer.order[viewer.order.indexOf(vg.id) + 1];

      const ng = live.find((g) => g.id === nextId);

      if (ng && ng.items.length) {
        setViewer({
          ...viewer,
          gid: ng.id,
          idx: 0,
        });
      } else {
        return closeViewer();
      }
    }

    resetPlay();
  };

  const goPrev = () => {
    if (!vg) return;

    if (viewer.idx > 0) {
      setViewer({
        ...viewer,
        idx: viewer.idx - 1,
      });
    } else {
      const prevId = viewer.order[viewer.order.indexOf(vg.id) - 1];

      const pg = live.find((g) => g.id === prevId);

      if (pg && pg.items.length) {
        setViewer({
          ...viewer,
          gid: pg.id,
          idx: pg.items.length - 1,
        });
      }
    }

    resetPlay();
  };

  handlers.current = {
    goNext,
    goPrev,
    closeViewer,
  };

  // ====================================================
  // AUTO PLAY
  // ====================================================

  useEffect(() => {
    if (!viewer || paused) return;

    const id = setInterval(() => {
      setProgress((p) => Math.min(1, p + 50 / DURATION));
    }, 50);

    return () => clearInterval(id);
  }, [viewer, paused]);

  useEffect(() => {
    if (viewer && progress >= 1) {
      handlers.current.goNext();
    }
  }, [progress]);

  // ====================================================
  // VIEWER AUDIO — play / pause with the story
  // ====================================================

  useEffect(() => {
    const audio = viewerAudioRef.current;

    if (!audio) return;

    if (paused) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        // Autoplay can be blocked until the user interacts with the page
        console.warn("Story audio could not start:", err);
      });
    }
  }, [paused, item?.id, viewerMusicSrc]);

  // ====================================================
  // MARK AS SEEN (state + remembered in localStorage)
  // ====================================================

  useEffect(() => {
    if (!item || item.seen) return;

    saveSeen(item.id);

    setGroups((prev) =>
      prev.map((g) =>
        g.id === vg.id
          ? {
              ...g,

              items: g.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      seen: true,
                    }
                  : i,
              ),
            }
          : g,
      ),
    );
  }, [item?.id]);

  // ====================================================
  // VIEWER KEYBOARD
  // ====================================================

  useEffect(() => {
    if (!viewer) return;

    const onKey = (e) => {
      if (e.target.tagName === "INPUT") {
        return;
      }

      if (e.key === "ArrowRight") {
        handlers.current.goNext();
      }

      if (e.key === "ArrowLeft") {
        handlers.current.goPrev();
      }

      if (e.key === "Escape") {
        handlers.current.closeViewer();
      }
    };

    document.addEventListener("keydown", onKey);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);

      document.body.style.overflow = "";
    };
  }, [viewer]);

  // ====================================================
  // COMPOSER KEYBOARD
  // ====================================================

  useEffect(() => {
    if (!composer) return;

    const onKey = (e) => {
      if (e.key === "Escape") {
        if (musicSheet) {
          setMusicSheet(false);
        } else {
          setComposer(null);
        }
      }
    };

    document.addEventListener("keydown", onKey);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);

      document.body.style.overflow = "";
    };
  }, [!!composer, musicSheet]);

  // ====================================================
  // COMPOSER
  // ====================================================
  const openComposer = (type = "text") => {
    setMusicSheet(false);

    setComposer({
      type,
      text: "",
      code: "",
      lang: LANGS[0],
      bg: BGS[0],
      image: "",
      imageFile: null,
      previewUrl: "",
      music: null,
      musicPos: { x: 7, y: 68 },
      musicStyle: "full",
      musicRot: 0,
      musicScale: 1,
    });
  };

  const patch = (p) =>
    setComposer((c) => ({
      ...c,
      ...p,
    }));

  // ====================================================
  // IMAGE
  // ====================================================
  const pickImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please select a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setComposer((prev) => ({
      ...prev,
      imageFile: file,
      previewUrl,
    }));

    event.target.value = "";
  };

  // ====================================================
  // CAN POST
  // ====================================================

  const canPost =
    composer &&
    !posting &&
    (composer.type === "text"
      ? composer.text.trim()
      : composer.type === "code"
        ? composer.code.trim()
        : Boolean(composer.imageFile));

  // ====================================================
  // POST
  // ====================================================

  const postStatus = async () => {
    if (!canPost) return;

    const c = composer;

    if (!getToken()) {
      alert("Please log in again. Authentication token not found.");
      return;
    }

    setPosting(true);

    try {
      let response;

      if (c.type === "photo") {
        if (!c.imageFile) {
          throw new Error("Please choose a photo first.");
        }

        const formData = new FormData();

        formData.append("type", "image");
        formData.append("image", c.imageFile);
        formData.append("text", c.text.trim());
        formData.append("background", c.bg);

        formData.append(
          "music",
          JSON.stringify(
            c.music
              ? {
                  id: c.music.id,
                  title: c.music.title,
                  artist: c.music.artist,
                  cover: c.music.cover || "",
                  previewUrl: c.music.previewUrl || "",
                  musicUrl: c.music.musicUrl || "",
                }
              : null,
          ),
        );

        formData.append("musicPos", JSON.stringify(c.musicPos));
        formData.append("musicStyle", c.musicStyle);
        formData.append("musicRot", String(c.musicRot));
        ("musicScale", String(c.musicScale));

        response = await fetch(STORIES_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: formData,
        });
      } else {
        const payload = {
          type: c.type,
          text: c.text.trim(),
          code: c.code,
          lang: c.lang,
          background: c.bg,
          music: c.music
            ? {
                id: c.music.id,
                title: c.music.title,
                artist: c.music.artist,
                cover: c.music.cover || "",
                previewUrl: c.music.previewUrl || "",
                musicUrl: c.music.musicUrl || "",
              }
            : null,
          musicPos: c.musicPos,
          musicStyle: c.musicStyle,
          musicRot: c.musicRot,
          musicScale: c.musicScale,
        };

        response = await fetch(STORIES_URL, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to publish story.");
      }

      const it = mapStory({ ...data.story, isMine: true }, new Set());

      if (it.music && c.music?.duration) {
        it.music.duration = c.music.duration;
      }

      setGroups((prev) =>
        prev.map((g) => (g.mine ? { ...g, items: [...g.items, it] } : g)),
      );

      if (c.previewUrl) {
        URL.revokeObjectURL(c.previewUrl);
      }

      setComposer(null);
      setMusicSheet(false);
    } catch (error) {
      console.error("Publish story error:", error);
      alert(error.message || "Could not publish story.");
    } finally {
      setPosting(false);
    }
  };

  // ====================================================
  // DELETE (removes it from the database too)
  // ====================================================

  const deleteCurrent = async () => {
    if (!item) return;

    const target = item;

    try {
      const response = await fetch(`${STORIES_URL}/${target.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not delete story.");
      }
    } catch (error) {
      console.error("Delete story error:", error);
      alert(error.message || "Could not delete story.");
      return;
    }

    setGroups((prev) =>
      prev.map((g) =>
        g.mine
          ? {
              ...g,
              items: g.items.filter((i) => i.id !== target.id),
            }
          : g,
      ),
    );

    if (vg.items.length <= 1) {
      closeViewer();
    } else {
      setViewer({
        ...viewer,
        idx: Math.max(0, viewer.idx - 1),
      });

      resetPlay();
    }
  };

  // ====================================================
  // REPLY
  // ====================================================

  const sendReply = () => {
    if (!reply.trim()) return;

    setReply("");

    setSent(true);
  };

  // ====================================================
  // TAP
  // ====================================================

  const tap = (fn) => () => {
    if (Date.now() - holdStart.current > 250) {
      return;
    }

    fn();
  };

  // ====================================================
  // TEXT COLOR
  // ====================================================

  const textColor = (bg) => (isLight(bg) ? "#050505" : "#fff");

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <section className="st" aria-label="Stories">
      <div className="st-head">
        <div>
          <span className="section-kicker">
            <span className="eyebrow-line" />
            STORIES
          </span>

          <h2>Stories from your orbit</h2>
        </div>
      </div>

      {/* ==================================================
          STORY ROW
      ================================================== */}

      <div className="st-row">
        <div className="st-tile">
          <button
            type="button"
            className="st-tile-btn"
            onClick={() => (me.items.length ? openViewer(me) : openComposer())}
            aria-label={me.items.length ? "View your story" : "Add story"}
          >
            <Ring items={me.items} initial={userInitial} />
          </button>

          <button
            type="button"
            className="st-add"
            onClick={() => openComposer()}
            aria-label="Add to your Story"
          >
            <AddRoundedIcon
              style={{
                fontSize: 14,
              }}
            />
          </button>

          <strong>You</strong>
        </div>

        {friends.map((g) => (
          <button
            type="button"
            key={g.id}
            className="st-tile st-tile-btn"
            onClick={() => openViewer(g)}
          >
            <Ring items={g.items} initial={g.initial} />

            <strong>{g.name}</strong>
          </button>
        ))}
      </div>

      {storiesLoading && (
        <p
          role="status"
          style={{ opacity: 0.6, fontSize: 13, margin: "8px 0" }}
        >
          Loading stories...
        </p>
      )}

      {storiesError && (
        <p
          role="alert"
          style={{ color: "#ff6b6b", fontSize: 13, margin: "8px 0" }}
        >
          {storiesError}
        </p>
      )}

      {/* ==================================================
          COMPOSER
      ================================================== */}

      {composer &&
        createPortal(
          <div
            className="st-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="New story"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setComposer(null);
              }
            }}
          >
            <div
              className={`st-phone st-compose ${
                composer.type === "text" && isLight(composer.bg) ? "light" : ""
              }`}
              style={{
                backgroundColor:
                  composer.type === "text" ? composer.bg : "#000",
              }}
            >
              {composer.type === "text" && <Aurora />}

              <div className="st-compose-top">
                <button
                  type="button"
                  className="st-icon"
                  onClick={() => setComposer(null)}
                  aria-label="Close"
                >
                  <CloseRoundedIcon />
                </button>

                <div className="st-types">
                  {[
                    ["text", TextFieldsRoundedIcon, "Text"],
                    ["photo", PhotoCameraOutlinedIcon, "Photo"],
                    ["code", CodeRoundedIcon, "Code"],
                  ].map(([key, Icon, label]) => (
                    <button
                      type="button"
                      key={key}
                      className={composer.type === key ? "on" : ""}
                      onClick={() =>
                        patch({
                          type: key,
                        })
                      }
                    >
                      <Icon fontSize="small" />

                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="st-compose-body">
                {composer.type === "text" && (
                  <textarea
                    autoFocus
                    maxLength={160}
                    value={composer.text}
                    onChange={(e) =>
                      patch({
                        text: e.target.value,
                      })
                    }
                    placeholder="What are you up to?"
                    style={{
                      color: textColor(composer.bg),
                    }}
                  />
                )}

                {composer.type === "photo" && (
                  <>
                    {composer.previewUrl ? (
                      <img
                        src={composer.previewUrl}
                        alt="Preview"
                        className="st-photo"
                      />
                    ) : (
                      <label className="st-pick">
                        <PhotoCameraOutlinedIcon />

                        <span>Choose a photo</span>

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={pickImage}
                          hidden
                        />
                      </label>
                    )}

                    <input
                      className="st-caption"
                      maxLength={100}
                      value={composer.text}
                      onChange={(e) =>
                        patch({
                          text: e.target.value,
                        })
                      }
                      placeholder="Add a caption"
                    />
                  </>
                )}

                {composer.type === "code" && (
                  <>
                    <select
                      value={composer.lang}
                      onChange={(e) =>
                        patch({
                          lang: e.target.value,
                        })
                      }
                      className="st-lang"
                    >
                      {LANGS.map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>

                    <textarea
                      autoFocus
                      className="st-codearea"
                      value={composer.code}
                      onChange={(e) =>
                        patch({
                          code: e.target.value,
                        })
                      }
                      placeholder="Paste a snippet"
                      spellCheck={false}
                      maxLength={400}
                    />
                  </>
                )}
              </div>

              {/* SELECTED MUSIC */}

              {composer.music && (
                <Draggable
                  pos={composer.musicPos}
                  rotation={composer.musicRot}
                  scale={composer.musicScale}
                  variant={composer.musicStyle}
                  onChange={patch}
                >
                  <SongCard
                    song={composer.music}
                    playing
                    variant={composer.musicStyle}
                    onClick={() =>
                      patch({
                        musicStyle:
                          composer.musicStyle === "pill" ? "full" : "pill",
                      })
                    }
                    onRemove={() =>
                      patch({
                        music: null,
                      })
                    }
                  />
                </Draggable>
              )}

              {/* COMPOSER AUDIO — plays the chosen song while composing.
                  Paused while the music picker is open so the two
                  previews don't overlap. */}
              {!musicSheet && songSrc(composer.music) && (
                <audio
                  key={composer.music.id}
                  src={songSrc(composer.music)}
                  autoPlay
                  loop
                  preload="auto"
                />
              )}

              <div className="st-compose-bottom">
                {composer.type === "text" ? (
                  <div className="st-bgs">
                    {BGS.map((b) => (
                      <button
                        type="button"
                        key={b}
                        aria-label={`Background ${b}`}
                        className={composer.bg === b ? "on" : ""}
                        style={{
                          background: b,
                        }}
                        onClick={() =>
                          patch({
                            bg: b,
                          })
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  className="st-music-btn"
                  onClick={() => setMusicSheet(true)}
                  aria-label={composer.music ? "Change music" : "Add music"}
                >
                  <MusicNoteRoundedIcon fontSize="small" />

                  <span>{composer.music ? "Change" : "Music"}</span>
                </button>

                <button
                  type="button"
                  className="st-post"
                  disabled={!canPost}
                  onClick={postStatus}
                >
                  {posting ? "Sharing..." : "Share to story"}
                </button>
              </div>
            </div>

            {/* Music picker opens on top of the composer, same style as the story overlay */}
            <MusicPicker
              open={musicSheet}
              selected={composer.music}
              onPick={(song) => patch({ music: song })}
              onClose={() => setMusicSheet(false)}
            />
          </div>,
          document.body,
        )}

      {/* ==================================================
          VIEWER
      ================================================== */}

      {viewer &&
        vg &&
        item &&
        createPortal(
          <div
            className="st-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={`${vg.name}'s status`}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeViewer();
              }
            }}
          >
            <button
              type="button"
              className="st-nav prev"
              onClick={goPrev}
              aria-label="Previous status"
            >
              <ChevronLeftRoundedIcon />
            </button>

            <div
              className={`st-phone ${
                item.type === "text" && isLight(item.bg) ? "light" : ""
              }`}
              style={{
                backgroundColor: item.type === "text" ? item.bg : "#000",
              }}
            >
              {item.type === "text" && <Aurora />}

              {item.type === "photo" && (
                <div
                  className="st-blur"
                  aria-hidden="true"
                  style={{
                    backgroundImage: `url(${item.image})`,
                  }}
                />
              )}

              <div className="st-bars">
                {vg.items.map((it, i) => (
                  <div key={it.id} className="st-bar">
                    <i
                      style={{
                        width:
                          i < viewer.idx
                            ? "100%"
                            : i === viewer.idx
                              ? `${progress * 100}%`
                              : "0%",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div
                className="st-user"
                style={{
                  color: item.type === "text" ? textColor(item.bg) : "#fff",
                }}
              >
                <div className="st-user-avatar">{vg.initial}</div>

                <strong>{vg.name}</strong>

                <span>{ago(now - item.createdAt)}</span>

                <button
                  type="button"
                  className="st-icon"
                  onClick={closeViewer}
                  aria-label="Close"
                >
                  <CloseRoundedIcon />
                </button>
              </div>

              <div
                className="st-stage"
                onPointerDown={() => {
                  holdStart.current = Date.now();

                  setPaused(true);
                }}
                onPointerUp={() => setPaused(false)}
                onPointerLeave={() => setPaused(false)}
              >
                <button
                  type="button"
                  className="st-zone left"
                  onClick={tap(goPrev)}
                  aria-label="Previous"
                />

                <button
                  type="button"
                  className="st-zone right"
                  onClick={tap(goNext)}
                  aria-label="Next"
                />

                {item.type === "text" && (
                  <p
                    key={item.id}
                    className="st-text"
                    style={{
                      color: textColor(item.bg),
                    }}
                  >
                    {item.text.split(" ").map((w, i, arr) => (
                      <span
                        key={i}
                        className="st-word"
                        style={{
                          animationDelay: `${i * 55}ms`,
                        }}
                      >
                        {w}

                        {i < arr.length - 1 ? "\u00A0" : ""}
                      </span>
                    ))}
                  </p>
                )}

                {item.type === "photo" && (
                  <>
                    <img
                      src={item.image}
                      alt={item.text || "Status"}
                      className="st-photo"
                    />

                    {item.text && <p className="st-cap">{item.text}</p>}
                  </>
                )}

                {item.type === "code" && (
                  <div className="st-code">
                    <span className="st-code-head">
                      <i />
                      <i />
                      <i />

                      <em>{item.lang}</em>
                    </span>

                    <pre>{item.code}</pre>
                  </div>
                )}
              </div>

              {/* VIEWER AUDIO — this is what actually plays the song.
                  key={item.id} restarts the audio for every story item. */}
              {viewerMusicSrc && (
                <audio
                  key={item.id}
                  ref={viewerAudioRef}
                  src={viewerMusicSrc}
                  autoPlay
                  loop
                  preload="auto"
                  onError={(e) =>
                    console.error("Story audio failed to load:", {
                      code: e.currentTarget.error?.code,
                      source: e.currentTarget.currentSrc,
                    })
                  }
                />
              )}

              {/* VIEWER MUSIC CARD */}

              {item.music && (
                <div
                  className={`st-song-slot drag viewer-pos ${
                    item.musicStyle === "pill" ? "pill" : ""
                  }`}
                  style={{
                    left: `${item.musicPos?.x ?? 7}%`,
                    top: `${item.musicPos?.y ?? 68}%`,
                    transform: `rotate(${item.musicRot ?? 0}deg) scale(${
                      item.musicScale ?? 1
                    })`,
                  }}
                >
                  <SongCard
                    song={item.music}
                    playing={!paused}
                    progress={progress}
                    variant={item.musicStyle}
                  />
                </div>
              )}

              <div className="st-foot">
                {vg.mine ? (
                  <>
                    <span>Expires in {ago(item.createdAt + DAY - now)}</span>

                    <button
                      type="button"
                      className="st-icon"
                      onClick={deleteCurrent}
                      aria-label="Delete status"
                    >
                      <DeleteOutlineRoundedIcon />
                    </button>
                  </>
                ) : sent ? (
                  <span className="st-sent">Reply sent</span>
                ) : (
                  <div className="st-reply">
                    <input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onFocus={() => setPaused(true)}
                      onBlur={() => setPaused(false)}
                      onKeyDown={(e) => e.key === "Enter" && sendReply()}
                      placeholder={`Reply to ${vg.name}`}
                    />

                    <button
                      type="button"
                      onClick={sendReply}
                      disabled={!reply.trim()}
                      aria-label="Send reply"
                    >
                      <SendRoundedIcon fontSize="small" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              className="st-nav next"
              onClick={goNext}
              aria-label="Next status"
            >
              <ChevronRightRoundedIcon />
            </button>
          </div>,
          document.body,
        )}
    </section>
  );
}
