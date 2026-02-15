import React, { useEffect, useMemo, useState } from "react";
import { apiGet, getSessionToken, setSessionToken, clearSessionToken } from "./api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Results from "./components/Results";

const THEME_KEY = "pp3_theme";

const getInitialDark = () => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark") return true;
  if (saved === "light") return false;

  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
}

const setTheme = (dark) => {
  const root = document.documentElement;
  if (dark) root.classList.add("dark");
  else root.classList.remove("dark");
}

const captureSessionFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("session");
  if (!token) return false;

  setSessionToken(token);
  window.history.replaceState({}, "", window.location.pathname);
  return true;
}

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
}

const normalizeSearch = (data) => {
  return (data?.items || []).map((it) => ({
    videoId: it?.id?.videoId,
    title: it?.snippet?.title,
    description: it?.snippet?.description,
    publishedAt: it?.snippet?.publishedAt,
    thumbnails: it?.snippet?.thumbnails,
    channelTitle: it?.snippet?.channelTitle
  }));
}

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

  const loadMe = async () => {
    try {
      const data = await apiGet("/auth/me");
      setMe(data);
      return true;
    } catch {
      setMe({ user: null });
      return false;
    }
  }

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
  }

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
  }

  const logout = () => {
    clearSessionToken();
    setMe({ user: null });
    setResults([]);
    setRecent([]);
    setQuery("");
  }

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
