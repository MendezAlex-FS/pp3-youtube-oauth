/**
 *
 * Sends an authenticated request to the YouTube Data API v3.
 * 
 * @param {*} path YouTube API endpoint path (e.g., "search", "playlistItems")
 * @param {*} accessToken OAuth 2.0 access token for the user
 * @param {*} params Optional object of query parameters to append to the request
 * @returns {*} Parsed JSON response from the YouTube API
 * @throws {Error} If the YouTube API returns a non-OK response or error object
 */
const requestYouTubeData = async (path, accessToken, params = {}) => {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  const data = await res.json().catch(() => ({}));

  // It's You Tube, not me :)
  if (!res.ok || data?.error) {
    console.error("[YouTube API ERROR]", {
      status: res.status,
      statusText: res.statusText,
      path,
      url: url.toString(),
      error: data?.error
    });

    const msg = data?.error?.message || `YouTube request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
};

module.exports = { requestYouTubeData };
