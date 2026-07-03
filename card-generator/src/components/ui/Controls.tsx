import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// 字段标签
export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block mb-4">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs font-medium text-ink/70 tracking-wide">{label}</span>
        {hint && <span className="text-[10px] text-muted">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

// 文本输入
export const TextInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full px-3 py-2 text-sm bg-paper border border-line rounded-lg",
        "focus:outline-none focus:border-clay focus:ring-2 focus:ring-clay/15",
        "placeholder:text-muted/50 transition-colors",
        className
      )}
      {...props}
    />
  )
);
TextInput.displayName = "TextInput";

// 文本域
export function TextArea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full px-3 py-2 text-sm bg-paper border border-line rounded-lg resize-none",
        "focus:outline-none focus:border-clay focus:ring-2 focus:ring-clay/15",
        "placeholder:text-muted/50 transition-colors scroll-thin",
        className
      )}
      {...props}
    />
  );
}

// 下拉选择
export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full px-3 py-2 text-sm bg-paper border border-line rounded-lg cursor-pointer",
        "focus:outline-none focus:border-clay focus:ring-2 focus:ring-clay/15 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

// 滑块
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs font-medium text-ink/70 tracking-wide">{label}</span>
        <span className="text-xs font-mono text-clay tabular-nums">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

// 主按钮
export function PrimaryButton({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white",
        "bg-clay rounded-lg shadow-soft hover:bg-clay-deep hover:shadow-lift",
        "active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-clay disabled:hover:shadow-soft",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 次按钮
export function GhostButton({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-ink",
        "bg-transparent border border-line rounded-lg hover:bg-paper hover:border-clay/40",
        "active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 图标按钮
export function IconButton({
  className,
  children,
  active,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center w-9 h-9 rounded-lg text-ink/70",
        "hover:bg-paper hover:text-clay transition-colors",
        active && "bg-clay/10 text-clay",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 区块标题
export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3 mt-2 first:mt-0">
      <h3 className="text-sm font-semibold text-ink tracking-wide">{children}</h3>
      {action}
    </div>
  );
}
