const ITUNES_SEARCH_URL = "https://itunes.apple.com/search";

const searchMusic = async (req, res) => {
  try {
    const query = (req.query.q || "").trim();
    const searchTerm = query || "popular hits";

    const url = new URL(ITUNES_SEARCH_URL);
    url.searchParams.set("term", searchTerm);
    url.searchParams.set("entity", "song");
    url.searchParams.set("limit", "20");
    url.searchParams.set("country", "IN");

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Music provider is unavailable.",
      });
    }

    const data = await response.json();

    const songs = data.results.map((track) => ({
      id: track.trackId,
      title: track.trackName,
      artist: track.artistName,
      album: track.collectionName || "",
      artwork: track.artworkUrl100 || "",
      previewUrl: track.previewUrl || null,
      musicUrl: track.trackViewUrl || "",
    }));

    return res.status(200).json({
      success: true,
      count: songs.length,
      songs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch music.",
    });
  }
};

module.exports = { searchMusic };
