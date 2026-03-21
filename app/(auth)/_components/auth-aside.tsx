const REGISTRATION_STEPS = [
  {
    n: 1,
    title: "Utwórz konto",
    desc: "Email, numer telefonu, hasło i weryfikacja",
  },
  {
    n: 2,
    title: "Wypełnij swoje dane",
    desc: "Dane bezpośrednio na przyszłym prawojazdy",
  },
  {
    n: 3,
    title: "Wyślij PKK",
    desc: "Zdjęcie lub skan dokumentu",
  },
] as const;

export function AuthAside() {
  return (
    <aside className="w-full shrink-0 overflow-hidden rounded-3xl bg-linear-to-br from-stone-900 via-stone-900 to-stone-950 p-6 shadow-2xl sm:p-8 lg:w-100 lg:self-stretch lg:p-10">
      <div className="space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-xs font-semibold uppercase tracking-widest text-red-400">
            OSK Leżajsk
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="text-balance text-2xl font-bold leading-tight text-white sm:text-3xl">
            Twoje przyszłe
            <br />
            prawo jazdy <span className="text-red-400">zaczyna się tutaj.</span>
          </h2>
          <p className="text-pretty text-sm leading-relaxed text-stone-400">
            Przejdź proces rejestracji, uzupełnij dane bezpośrednio na makiecie
            prawa jazdy i prześlij PKK do akceptacji.
          </p>
        </div>

        <div className="h-px bg-linear-to-r from-red-500/30 via-stone-700 to-transparent" />

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-5">
          {REGISTRATION_STEPS.map((step) => (
            <div key={step.n} className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600/20 text-sm font-bold text-red-400 ring-1 ring-red-500/30">
                {step.n}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{step.title}</p>
                <p className="mt-0.5 text-xs text-stone-500">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-stone-800 pt-5 lg:mt-10 lg:pt-6">
        <p className="text-xs font-medium text-stone-600">
          © 2026 OSK Józef Majkut
        </p>
        <p className="mt-0.5 text-xs text-stone-700">
          Leżajsk, woj. podkarpackie
        </p>
      </div>
    </aside>
  );
}
