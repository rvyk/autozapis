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
      <div className="hidden flex-col items-end sm:flex">
        <span className="text-sm font-semibold text-stone-900">{fullName}</span>
        <span className="text-xs text-stone-500 hover:text-red-600">
          <button onClick={onSignOut}>Wyloguj się</button>
        </span>
      </div>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 font-semibold text-red-700 ring-2 ring-white">
        {initials}
      </div>
    </div>
  );
}
