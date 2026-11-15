#!/usr/bin/env python3
"""Build data.js and art/ for the Nyx TV mockups from Nyx Theater's Plex cache.

Reads ~/.cache/nyx-theater/library.sqlite3 (read-only) and copies the artwork it needs
into art/. Both outputs are git-ignored: they are Ken's library, not part of the design.
"""
import json
import os
import re
import shutil
import sqlite3
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.expanduser("~/.cache/nyx-theater")
ART_SRC = os.path.join(CACHE, "artwork")
ART_OUT = os.path.join(HERE, "art")

db = sqlite3.connect(f"file:{CACHE}/library.sqlite3?mode=ro", uri=True)

# Artwork by key without its size suffix: /library/metadata/1/thumb/123 -> [(w, h, file)].
art = defaultdict(list)
for key, path in db.execute("select artwork_key, local_path from artwork"):
    m = re.match(r"(/library/metadata/\d+/(?:thumb|art)/\d+)/(\d+)/(\d+)$", key)
    if not m:
        continue
    f = os.path.join(ART_SRC, os.path.basename(path))
    if os.path.exists(f):
        art[m.group(1)].append((int(m.group(2)), int(m.group(3)), f))

copied = {}


def ext_of(f):
    with open(f, "rb") as fh:
        head = fh.read(12)
    if head.startswith(b"\x89PNG"):
        return "png"
    if head[:4] == b"RIFF" and head[8:12] == b"WEBP":
        return "webp"
    return "jpg"


def pick(key, landscape):
    """The local copy of an artwork key, the largest cached size; None when not cached."""
    if not key or key not in art:
        return None
    sizes = [s for s in art[key] if (s[0] > s[1]) == landscape] or art[key]
    w, h, f = max(sizes, key=lambda s: s[0] * s[1])
    if f not in copied:
        name = f"{len(copied):04d}.{ext_of(f)}"
        shutil.copyfile(f, os.path.join(ART_OUT, name))
        copied[f] = f"art/{name}"
    return copied[f]


items = {}
for (md,) in db.execute("select metadata from media"):
    m = json.loads(md)
    items[m["id"]["id"]] = m


def rating(m):
    out = {}
    for r in m["metadata"].get("ratings", []):
        out[r["source"]] = round(r["value"] / r["scale"] * (100 if r["source"].startswith("rt") else 10), 1)
    return out


def badges(m):
    b = []
    for v in m.get("versions") or []:
        if (v.get("width") or 0) >= 3800:
            b.append("4K")
        hdr = (v.get("technical") or {}).get("hdr")
        if hdr:
            b.append({"dolby_vision": "Dolby Vision"}.get(str(hdr).lower(), str(hdr).upper()))
        break
    return b


def card(m, landscape=False):
    series = items.get((m.get("series") or {}).get("id", ""), {})
    poster = pick(m.get("poster"), False) if m["kind"] != "episode" else None
    poster = poster or pick(m["tv"].get("series_poster"), False) or pick(series.get("poster"), False)
    backdrop = pick(m.get("backdrop"), True) or pick(series.get("backdrop"), True)
    thumb = pick(m.get("poster"), True) if m["kind"] == "episode" else None
    w = m["watch"]
    return {
        "id": m["id"]["id"],
        "kind": m["kind"],
        "title": m["title"],
        "series": m["tv"].get("series_title"),
        "season": m.get("season_number"),
        "episode": m.get("episode_number"),
        "year": m.get("year"),
        "summary": m.get("summary") or "",
        "tagline": m["metadata"].get("tagline") or "",
        "genres": m["metadata"].get("genres", [])[:3],
        "cert": m["metadata"].get("certification"),
        "minutes": round((m.get("duration_ms") or 0) / 60000),
        "progress": round(w["position_ms"] / m["duration_ms"], 3) if w["position_ms"] and m.get("duration_ms") else 0,
        "watched": w["watched"],
        "unwatched": m["metadata"].get("unwatched_episodes") or m["tv"].get("unwatched_episodes"),
        "poster": poster,
        "backdrop": backdrop,
        "thumb": thumb,
        "ratings": rating(m),
        "badges": badges(m),
        "cast": [c["name"] for c in m["metadata"].get("credits", []) if c["department"] == "Cast"][:8],
        "director": next((c["name"] for c in m["metadata"].get("credits", []) if c["department"] == "Directing"), None),
        "studio": (m["metadata"].get("studios") or [None])[0],
    }


movies = [m for m in items.values() if m["kind"] == "movie"]
series = [m for m in items.values() if m["kind"] == "series"]
episodes = [m for m in items.values() if m["kind"] == "episode"]
os.makedirs(ART_OUT, exist_ok=True)

has_poster = lambda m: m.get("poster") in art
has_backdrop = lambda m: m.get("backdrop") in art

recent_movies = [card(m) for m in sorted(filter(has_poster, movies), key=lambda m: -m["added_at"])[:30]]
recent_shows = [card(m) for m in sorted(filter(has_poster, series), key=lambda m: -m["added_at"])[:30]]
heroes = [card(m) for m in sorted(filter(has_backdrop, movies + series), key=lambda m: -m["added_at"])]
heroes = [h for h in heroes if h["summary"] and h["poster"]][:24]

in_progress = [m for m in items.values() if m["watch"]["position_ms"] > 0 and not m["watch"]["watched"]]
in_progress.sort(key=lambda m: -(m["watch"]["updated_at"] or 0))
continue_watching = [c for c in (card(m) for m in in_progress) if c["backdrop"] or c["thumb"]][:16]

by_series = defaultdict(list)
for e in episodes:
    if e.get("series"):
        by_series[e["series"]["id"]].append(e)
next_eps = []
for sid, eps in by_series.items():
    eps.sort(key=lambda e: (e.get("season_number") or 0, e.get("episode_number") or 0))
    for a, b in zip(eps, eps[1:]):
        if a["watch"]["watched"] and not b["watch"]["watched"] and not b["watch"]["position_ms"]:
            c = card(b)
            if c["backdrop"] or c["thumb"] or c["poster"]:
                next_eps.append((a["watch"]["updated_at"] or 0, c))
            break
next_eps = [c for _, c in sorted(next_eps, key=lambda t: -t[0])][:16]

# The library has one Plex collection; the rest are franchise groups of real titles, so
# the Collections row has something to show.
groups = defaultdict(list)
for m in filter(has_poster, movies):
    base = re.split(r":| - | Part | \d+$| [IVX]+$", m["title"])[0].strip()
    base = re.sub(r"^The ", "", base)
    if len(base) > 3:
        groups[base].append(m)
collections = []
for name, ms in sorted(groups.items(), key=lambda kv: -len(kv[1])):
    if len(ms) >= 3:
        ms.sort(key=lambda m: m.get("year") or 0)
        collections.append({"title": f"{name} Collection", "count": len(ms), "poster": pick(ms[0]["poster"], False),
                            "posters": [pick(m["poster"], False) for m in ms[:4]], "items": [card(m) for m in ms[:12]]})
collections = collections[:14]

genres = Counter(g for m in movies for g in m["metadata"].get("genres", []))

# Show details: the cached series whose seasons and episodes are best covered.
show = None
for item, md, children in db.execute("select item, metadata, children from details"):
    m = json.loads(md)
    if m["kind"] != "series" or not has_backdrop(m) and not has_poster(m):
        continue
    seasons = json.loads(children)
    if not seasons:
        continue
    eps_row = db.execute("select children from details where item=?", (seasons[0]["id"]["id"],)).fetchone()
    eps = json.loads(eps_row[0]) if eps_row else []
    score = len(eps) + 5 * has_backdrop(m)
    if eps and (show is None or score > show[0]):
        show = (score, m, seasons, eps)
_, sm, seasons, eps = show
show_detail = card(sm)
show_detail["seasons"] = [{"title": s["title"], "count": s["tv"].get("episode_count") or s["metadata"].get("episode_count"),
                           "unwatched": s["metadata"].get("unwatched_episodes"), "poster": pick(s.get("poster"), False)} for s in seasons]
show_detail["episodes"] = []
for e in eps:
    full = items.get(e["id"]["id"], e)
    c = card(full)
    c["thumb"] = c["thumb"] or pick(e.get("poster"), True)
    show_detail["episodes"].append(c)

dune = max((h for h in heroes if h["kind"] == "movie" and h["cast"]),
           key=lambda h: h["ratings"].get("rt_critic", 0) + h["ratings"].get("rt_audience", 0))
heroes.remove(dune)
heroes.insert(0, dune)
movie_detail = dict(dune)
same = [card(m) for m in movies if set(m["metadata"].get("genres", [])) & set(dune["genres"][:1]) and has_poster(m)]
movie_detail["related"] = [c for c in same if c["id"] != dune["id"]][:12]

def search(q):
    ql = q.lower()
    hit = lambda m: ql in m["title"].lower()
    return {
        "movies": [card(m) for m in movies if hit(m) and has_poster(m)][:10],
        "shows": [card(m) for m in series if hit(m) and has_poster(m)][:10],
        "episodes": [c for c in (card(m) for m in episodes if hit(m)) if c["backdrop"] or c["thumb"]][:8],
        "collections": [c for c in collections if ql in c["title"].lower()][:6],
    }


data = {
    "heroes": heroes,
    "continue": continue_watching,
    "recentMovies": recent_movies,
    "recentShows": recent_shows,
    "nextEpisodes": next_eps,
    "collections": collections,
    "genres": [g for g, _ in genres.most_common(14)],
    "counts": {"movies": len(movies), "shows": len(series), "episodes": len(episodes)},
    "movieDetail": movie_detail,
    "showDetail": show_detail,
    "search": {"q": "star", **search("star")},
}
with open(os.path.join(HERE, "data.js"), "w") as fh:
    fh.write("window.NYX = " + json.dumps(data, ensure_ascii=False) + ";\n")
print(f"{len(copied)} images, {len(heroes)} heroes, {len(continue_watching)} continue, "
      f"{len(next_eps)} next, {len(collections)} collections, show: {show_detail['title']} "
      f"({len(show_detail['episodes'])} eps), movie: {movie_detail['title']}")
