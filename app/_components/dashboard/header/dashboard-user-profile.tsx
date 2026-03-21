type DashboardUserProfileProps = {
  fullName: string;
  initials: string;
  onSignOut: () => void;
};

export function DashboardUserProfile({
  fullName,
  initials,
  onSignOut,
}: DashboardUserProfileProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden flex-col items-end md:flex">
        <span className="text-sm font-semibold text-stone-900">{fullName}</span>
        <span className="text-xs text-stone-500 hover:text-red-600">
          <button onClick={onSignOut}>Wyloguj się</button>
        </span>
      </div>
      <button
        type="button"
        onClick={onSignOut}
        className="inline-flex rounded-md border border-stone-200 px-2.5 py-1 text-xs font-medium text-stone-600 md:hidden"
      >
        Wyloguj
      </button>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 font-semibold text-red-700 ring-2 ring-white">
        {initials}
      </div>
    </div>
  );
}
