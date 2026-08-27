export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark inline-flex items-baseline gap-[0.28em] leading-none ${className}`}>
      <span>UK</span>
      <span className="font-normal tracking-[0.18em] text-primary">09</span>
    </span>
  );
}
