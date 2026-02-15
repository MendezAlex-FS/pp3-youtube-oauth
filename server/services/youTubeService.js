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
