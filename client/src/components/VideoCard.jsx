function pickThumb(thumbnail) {
  return (
    thumbnail?.maxres?.url ||
    thumbnail?.standard?.url ||
    thumbnail?.high?.url ||
    thumbnail?.medium?.url ||
    thumbnail?.default?.url ||
    ""
  );
}

const styles = {
  card:
    [
      "group block overflow-hidden rounded-2xl border border-zinc-200 bg-white",
      "shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    ].join(" "),
  mediaWrap: "aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800",
  image: "h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]",
  noThumb: "flex h-full w-full items-center justify-center text-sm text-zinc-500",
  body: "p-4",
  title: "line-clamp-2 text-base font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100",
  meta: "mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400",
  channel: "font-semibold",
  dot: "opacity-70",
  date: "opacity-80",
  description: "mt-3 line-clamp-3 text-sm text-zinc-700 dark:text-zinc-300"
};

export default function VideoCard({ video }) {
  const thumb = pickThumb(video?.thumbnails);
  const link = video?.videoId ? `https://www.youtube.com/watch?v=${video.videoId}` : "#";

  return (
    <a href={link} target="_blank" rel="noreferrer" className={styles.card}>
      <div className={styles.mediaWrap}>
        {thumb ? (
          <img src={thumb} alt={video?.title || "video"} className={styles.image} loading="lazy" />
        ) : (
          <div className={styles.noThumb}>No thumbnail</div>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.title}>
          {video?.title || "No title available"}
        </div>
        <div className={styles.meta}>
          <span className={styles.channel}>{video?.channelTitle || "No channel available"}</span>
          <span className={styles.dot}>•</span>
          <span className={styles.date}>
            {video?.publishedAt ? new Date(video.publishedAt).toLocaleDateString() : ""}
          </span>
        </div>
        {video?.description ? (<div className={styles.description}>{video.description}</div>) : null}
      </div>
    </a>
  );
}
