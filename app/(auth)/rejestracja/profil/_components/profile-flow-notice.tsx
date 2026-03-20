export function ProfileFlowNotice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/50 px-4 py-3">
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-pretty text-sm leading-relaxed text-red-900/70">
        Podgląd aktualizuje się na bieżąco. Upewnij się, że dane są poprawne
        przed kontynuowaniem.
      </p>
    </div>
  );
}
