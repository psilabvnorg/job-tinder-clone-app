# script/export_playlist.py
import json
import xml.etree.ElementTree as ET
from urllib.request import urlopen

PLAYLIST_ID = "PLPt6-BtUI22oveeGAyckbAXRSmTBGLZP4"
FEED_URL = f"https://www.youtube.com/feeds/videos.xml?playlist_id={PLAYLIST_ID}"
OUT_FILE = "public/data/playlist.json"

ns = {
    "atom": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
}

xml_data = urlopen(FEED_URL).read()
root = ET.fromstring(xml_data)

videos = []
for entry in root.findall("atom:entry", ns):
    video_id = entry.find("yt:videoId", ns).text
    title = entry.find("atom:title", ns).text
    videos.append({
        "id": video_id,
        "title": title,
        "url": f"https://www.youtube.com/watch?v={video_id}&list={PLAYLIST_ID}",
        "thumbnail": f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"
    })

with open(OUT_FILE, "w", encoding="utf-8") as f:
    json.dump(
        {"playlistId": PLAYLIST_ID, "count": len(videos), "videos": videos},
        f,
        ensure_ascii=False,
        indent=2
    )

print(f"Exported {len(videos)} videos to {OUT_FILE}")
