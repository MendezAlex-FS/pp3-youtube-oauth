const styles = {
  footer: "border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800",
  footerBrand: "font-bold text-zinc-600 dark:text-zinc-400"
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      PP3 Google OAuth and YouTube Data API by <span className={styles.footerBrand}>Alex Mendez</span>
    </footer>
  );
}
