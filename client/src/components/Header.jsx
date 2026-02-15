import Logo from "./Logo";
import { loginUrl } from "../api";

const styles = {
  header: "sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70",
  inner: "mx-auto flex h-20 max-w-6xl items-center gap-4 px-4",
  left: "flex min-w-[180px] items-center gap-3",
  logo: "w-9 h-9",
  leftTextWrap: "leading-tight",
  title: "text-sm font-black text-zinc-950 dark:text-zinc-50",
  subtitle: "text-xs text-zinc-500 dark:text-zinc-400",
  center: "flex flex-1 items-center justify-center",
  form: "w-full max-w-2xl",
  inputWrap: "relative",
  input:
    [
      "w-full rounded-2xl border px-4 py-3 pr-28 text-sm outline-none transition",
      "border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400",
      "focus:border-youtube-red focus:ring-4 focus:ring-red-100",
      "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500",
      "dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500",
      "dark:focus:ring-red-900/30 dark:disabled:bg-zinc-900/40"
    ].join(" "),
  searchBtnBase: "absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-4 py-2 text-sm font-extrabold transition",
  searchBtnAuthed: "bg-youtube-red text-white hover:bg-youtube-redDark",
  searchBtnDisabled: "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500",
  right: "flex min-w-[180px] items-center justify-end gap-2",
  darkToggle:
    [
      "rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-800",
      "transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
    ].join(" "),
  login: "rounded-xl bg-youtube-red px-4 py-2 text-xs font-extrabold text-white transition hover:bg-youtube-redDark",
  logout:
    [
      "rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-extrabold text-zinc-900 transition",
      "hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
    ].join(" "),

};

export default function Header({
  title = "PP3 Google OAuth",
  subTitle = "YouTube Data API",
  authed,
  query,
  onQueryChange,
  onSearch,
  onLogout,
  dark,
  onToggleDark
}) {
  const searchBtnClass = [
    styles.searchBtnBase,
    authed ? styles.searchBtnAuthed : styles.searchBtnDisabled
  ].join(" ");

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Logo className={styles.logo} />
          <div className={styles.leftTextWrap}>
            <div className={styles.title}>{title}</div>
            <div className={styles.subtitle}>{subTitle}</div>
          </div>
        </div>
        <div className={styles.center}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (authed) onSearch();
            }}
            className={styles.form}
          >
            <div className={styles.inputWrap}>
              <input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                disabled={!authed}
                placeholder={authed ? "Search YouTube videos…" : "Login to search…"}
                className={styles.input}
              />
              <button type="submit" disabled={!authed} className={searchBtnClass}>Search</button>
            </div>
          </form>
        </div>
        <div className={styles.right}>
          <button
            onClick={onToggleDark}
            className={styles.darkToggle}
            title="Toggle dark mode"
            type="button"
          >
            {dark ? "Light" : "Dark"}
          </button>
          {!authed ? (
            <a href={loginUrl()} className={styles.login}>
              Login
            </a>
          ) : (
            <button onClick={onLogout} className={styles.logout} type="button">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
