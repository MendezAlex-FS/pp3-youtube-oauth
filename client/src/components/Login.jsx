import Logo from "./Logo";
import { loginUrl } from "../api";

const styles = {
  wrapper: "mx-auto flex min-h-[calc(100vh-80px)] max-w-2xl flex-col items-center justify-center px-6 text-center",
  logo: "w-14 h-14",
  title: "mt-6 text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50",
  subtitle: "mt-3 text-base text-zinc-600 dark:text-zinc-300",
  loginBtn:
    [
      "mt-8 inline-flex w-full max-w-sm items-center justify-center rounded-2xl bg-youtube-red px-6 py-4 text-lg font-extrabold",
      "text-white shadow-sm transition hover:bg-youtube-redDark focus:outline-none focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900/40"
    ].join(" "),
  footnote: "mt-6 text-xs text-zinc-500 dark:text-zinc-500"
};

export default function Login() {
  return (
    <div className={styles.wrapper}>
      <Logo className={styles.logo} />
      <h1 className={styles.title}>Please Login</h1>
      <p className={styles.subtitle}>
        To search for YouTube videos, you must login to your Google account.
      </p>
      <a href={loginUrl()} className={styles.loginBtn}>Login</a>
      <div className={styles.footnote}>
        You’ll be redirected to Google, then back here.
      </div>
    </div>
  );
}
