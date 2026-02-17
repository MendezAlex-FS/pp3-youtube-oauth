import React, { useEffect, useMemo, useState } from "react";
import { apiGet, getSessionToken, setSessionToken, clearSessionToken } from "./api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Results from "./components/Results";

const THEME_KEY = "pp3_theme";

/**
 *
 * Determines the initial theme (dark/light) for the app.
 *
 * @param {*} none
 * @returns {boolean} True if dark mode should be enabled; otherwise false
 */
const getInitialDark = () => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark") return true;
  if (saved === "light") return false;

  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
};

/**
 *
 * Applies the theme by toggling the `dark` class on the <html> element.
 * Tailwind's `darkMode: "class"` uses this class to enable dark styles.
 *
 * @param {*} dark Whether to enable dark mode
 * @returns {*} none
 */
const setTheme = (dark) => {
  const root = document.documentElement;
  if (dark) root.classList.add("dark");
  else root.classList.remove("dark");
};

/**
 *
 * Captures the session token from the URL query string (e.g. ?session=JWT).
 * If found, stores it via setSessionToken() and removes it from the URL.
 *
 * @param {*} none
 * @returns {boolean} True if a session token was found and stored; otherwise false
 */
const captureSessionFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("session");
  if (!token) return false;

  setSessionToken(token);
  window.history.replaceState({}, "", window.location.pathname);
  return true;
};

/**
 *
 * Normalizes the /youtube/recent API response into the app's video shape.
 * The "recent" endpoint returns playlistItems where the videoId is nested
 * under snippet.resourceId.videoId.
 *
 * @param {*} data Raw JSON response from /youtube/recent
 * @returns {Array} Array of normalized video objects for rendering
 */
const normalizeRecent = (data) => {
  return (data?.items || []).map((video) => {
    const snippet = video.snippet || {};
    const videoId = snippet?.resourceId?.videoId;
    return {
      videoId: videoId,
      title: snippet.title,
      description: snippet.description,
      publishedAt: snippet.publishedAt,
      thumbnails: snippet.thumbnails,
      channelTitle: snippet.channelTitle
    };
  });
};

/**
 *
 * Normalizes the /youtube/search API response into the app's video shape.
 * The "search" endpoint returns items where the videoId is nested under id.videoId.
 *
 * @param {*} data Raw JSON response from /youtube/search
 * @returns {Array} Array of normalized video objects for rendering
 */
const normalizeSearch = (data) => {
  return (data?.items || []).map((it) => ({
    videoId: it?.id?.videoId,
    title: it?.snippet?.title,
    description: it?.snippet?.description,
    publishedAt: it?.snippet?.publishedAt,
    thumbnails: it?.snippet?.thumbnails,
    channelTitle: it?.snippet?.channelTitle
  }));
};

/**
 *
 * Main application component for the PP3 Google OAuth and YouTube Data API project.
 *
 * @param {*} none
 * @returns {*} React component
 */
export default function App() {
  const [dark, setDark] = useState(getInitialDark);
  const [me, setMe] = useState(null);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState([]);
  const [results, setResults] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState("");

  const authed = !!me?.user;

  useEffect(() => {
    setTheme(dark);
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  /**
   *
   * Loads the currently authenticated user from the server.
   * If the session token is invalid/expired, it sets `me` to { user: null }.
   *
   * @param {*} none
   * @returns {Promise<boolean>} True if authenticated; otherwise false
   */
  const loadMe = async () => {
    try {
      const data = await apiGet("/auth/me");
      setMe(data);
      return true;
    } catch {
      setMe({ user: null });
      return false;
    }
  };

  /**
   *
   * Loads the authenticated user's recent uploads from the server.
   * On auth failure, clears the session token and resets auth state.
   *
   * @param {*} none
   * @returns {*} none
   */
  const loadRecent = async () => {
    setLoadingRecent(true);
    setError("");
    try {
      const data = await apiGet("/youtube/recent");
      setRecent(normalizeRecent(data));
    } catch (e) {
      setError(String(e.message || e));
      clearSessionToken();
      setMe({ user: null });
    } finally {
      setLoadingRecent(false);
    }
  };

  /**
   *
   * Executes a YouTube search using the current query value.
   * If query is empty after trimming, clears results and exits early.
   * On auth failure, clears the session token and resets auth state.
   *
   * @param {*} none
   * @returns {*} none
   */
  const runSearch = async () => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoadingSearch(false);
      return;
    }

    setLoadingSearch(true);
    setError("");
    try {
      const data = await apiGet(`/youtube/search?q=${encodeURIComponent(q)}`);
      setResults(normalizeSearch(data));
    } catch (e) {
      setError(String(e.message || e));
      clearSessionToken();
      setMe({ user: null });
    } finally {
      setLoadingSearch(false);
    }
  };

  /**
   *
   * Logs out the user by clearing the session token and resetting state.
   *
   * @param {*} none
   * @returns {*} none
   */
  const logout = () => {
    clearSessionToken();
    setMe({ user: null });
    setResults([]);
    setRecent([]);
    setQuery("");
  };

  useEffect(() => {
    captureSessionFromUrl();

    if (getSessionToken()) {
      loadMe().then((ok) => {
        if (ok) loadRecent();
      });
    } else {
      setMe({ user: null });
    }
  }, []);

  /**
   *
   * Determines which set of videos to display:
   * - If there are search results, show those
   * - Otherwise show recent uploads
   *
   * @param {*} none
   * @returns {Array} Array of videos to render
   */
  const shownVideos = useMemo(() => {
    return results.length ? results : recent;
  }, [results, recent]);

  const styles = {
    shell: "min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100",
    main: "mx-auto max-w-6xl px-4 pb-10"
  };

  return (
    <div className={styles.shell}>
      <Header
        authed={authed}
        query={query}
        onQueryChange={setQuery}
        onSearch={runSearch}
        onLogout={logout}
        dark={dark}
        onToggleDark={() => setDark((v) => !v)}
        title="PP3 Google OAuth"
        subTitle="YouTube Data API"
      />
      <main className={styles.main}>
        {!authed ? (
          <Login />
        ) : (
          <Results
            me={me}
            query={query}
            error={error}
            results={results}
            shownVideos={shownVideos}
            loadingRecent={loadingRecent}
            loadingSearch={loadingSearch}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}