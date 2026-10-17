
const ITUNES_SEARCH_URL = "https://itunes.apple.com/search";

// GET /api/music/search?q=arijit
const searchMusic = async (req, res) => {
  try {
    // 1. Read the search term from the URL.
    const query = (req.query.q || "").trim();

    // 2. Use a default search when the user hasn't typed anything.
    const searchTerm = query || "popular hits";

    // 3. Build the external API URL.
    const url = new URL(ITUNES_SEARCH_URL);
    url.searchParams.set("term", searchTerm);
    url.searchParams.set("entity", "song");
    url.searchParams.set("limit", "20");
    url.searchParams.set("country", "IN");

    // 4. Request song data from Apple.
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Music provider is unavailable.",
      });
    }

    const data = await response.json();

    // 5. Return only the fields our frontend needs.
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
    console.error("Music search error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch music.",
    });
  }
};

module.exports = { searchMusic };
