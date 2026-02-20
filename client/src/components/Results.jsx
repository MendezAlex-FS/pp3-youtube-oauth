import VideoCard from "./VideoCard";

const styles = {
  content: "pt-8",
  topRow: "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
  title: "text-2xl font-black tracking-tight",
  subtitle: "mt-1 text-sm text-zinc-600 dark:text-zinc-400",
  meWrap: "mt-2 flex items-center gap-3 sm:mt-0",
  avatar: "h-9 w-9 rounded-full border border-zinc-200 dark:border-zinc-800",
  meRight: "text-right",
  meName: "text-sm font-extrabold",
  meEmail: "text-xs text-zinc-600 dark:text-zinc-400",
  errorBox:
    [
      "mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800",
      "dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200"
    ].join(" "),
  errorLabel: "font-extrabold",
  loadingText: "mt-6 text-sm text-zinc-600 dark:text-zinc-400",
  loadingRecentText: "mt-8 text-sm text-zinc-600 dark:text-zinc-400",
  section: "mt-8",
  emptyState:
    [
      "rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-700",
      "dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300"
    ].join(" "),
  grid: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
};

/**
 *
 * Results view for the authenticated portion of the app.
 *
 * @param {*} results Array of search results (used to determine UI mode)
 * @param {*} shownVideos Array of videos to render (results or recent)
 * @param {*} query Current search query string
 * @param {*} me Auth user payload
 * @param {*} loadingRecent Whether the recent uploads request is loading
 * @param {*} loadingSearch Whether the search request is loading
 * @param {*} error Error message string to display (if any)
 * @returns {*} React component for rendering results and video grid
 */
export default function Results({
  results = [],
  shownVideos = [],
  query = "",
  me = null,
  loadingRecent,
  loadingSearch,
  error,
}) {
  return (
    <div className={styles.content}>
      <div className={styles.topRow}>
        <div>
          <h2 className={styles.title}>
            {results.length ? "Search Results" : "Recent Uploads"}
          </h2>
          <p className={styles.subtitle}>
            {results.length
              ? `Showing matches for “${query.trim()}”.`
              : "Your most recent uploads pulled from your channel’s uploads playlist."}
          </p>
        </div>

        {me?.user && (
          <div className={styles.meWrap}>
            {me.user.picture ? (
              <img
                src={me.user.picture}
                alt="avatar"
                className={styles.avatar}
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            ) : null}
            <div className={styles.meRight}>
              <div className={styles.meName}>
                {me.user.name || me.user.email}
              </div>
              <div className={styles.meEmail}>{me.user.email}</div>
            </div>
          </div>
        )}
      </div>

      {error ? (
        <div className={styles.errorBox}>
          <span className={styles.errorLabel}>Error:</span> {error}
        </div>
      ) : null}

      {loadingRecent && !results.length ? (
        <div className={styles.loadingRecentText}>Loading recent videos…</div>
      ) : null}

      {loadingSearch ? (
        <div className={styles.loadingText}>Searching…</div>
      ) : null}

      <section className={styles.section}>
        {shownVideos.length === 0 ? (
          <div className={styles.emptyState}>
            {results.length
              ? "No results found."
              : "No uploads found (or none returned by the API)."}
          </div>
        ) : (
          <div className={styles.grid}>
            {shownVideos.map((video) => (
              <VideoCard
                key={video.videoId || `${video.title}-${video.publishedAt}`}
                video={video}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
