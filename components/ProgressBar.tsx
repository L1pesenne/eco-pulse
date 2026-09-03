export function ProgressBar({ value, className = "", color = "bg-[#b9ff76]" }: { value: number; className?: string; color?: string }) {
  return <div className={`h-1.5 overflow-hidden rounded-full bg-white/10 ${className}`}><div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>;
}
