const styles = {
  wrapper: "relative",
  bg: "absolute inset-0 rounded-xl bg-youtube-red shadow-sm",
  inner: "absolute inset-[18%] flex items-center justify-center",
  triangle: "h-0 w-0 border-y-[9px] border-y-transparent border-l-[14px] border-l-white translate-x-[1px]"
};

export default function Logo({ className = "w-8 h-8" }) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.bg} />
      <div className={styles.inner}>
        <div className={styles.triangle} />
      </div>
    </div>
  );
}
