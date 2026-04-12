interface Step {
  label: string;
}

interface Props {
  steps: Step[];
  current: number; // 0-indexed
  className?: string;
}

/**
 * Reusable linear step progress bar.
 * Shows completed (✓), active (numbered), and upcoming steps.
 */
export default function StepIndicator({ steps, current, className = "" }: Props) {
  return (
    <nav aria-label="Progress" className={`flex items-center ${className}`}>
      {steps.map((step, i) => {
        const done    = i < current;
        const active  = i === current;
        const upcoming = i > current;

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                aria-current={active ? "step" : undefined}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  done    ? "bg-green-500 border-green-500 text-white"
                  : active  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                    <path d="M1.5 6l3 3 6-6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-[10px] whitespace-nowrap hidden sm:block ${
                  done ? "text-green-600" : active ? "text-blue-600 font-medium" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line (not after last) */}
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 rounded-full transition-colors ${done ? "bg-green-400" : "bg-gray-200"}`}
                aria-hidden />
            )}
          </div>
        );
      })}
    </nav>
  );
}
