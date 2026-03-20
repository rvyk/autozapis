export function AuthBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_25%,rgba(220,38,38,0.07),transparent_40%),radial-gradient(circle_at_90%_15%,rgba(251,113,133,0.06),transparent_35%),radial-gradient(circle_at_70%_85%,rgba(220,38,38,0.05),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-white/60 to-transparent" />
    </>
  );
}
