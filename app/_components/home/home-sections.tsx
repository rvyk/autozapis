export function HomeTicker() {
  const items = [
    "Symulator jazdy 3D",
    "Małe grupy szkoleniowe",
    "Jazdy w nocy",
    "Egzamin wewnętrzny",
    "Elastyczne terminy",
    "Raty 0%",
    "97% zdawalność",
  ];

  return (
    <div className="overflow-hidden bg-red-600 py-3 text-white">
      <div className="animate-[ticker_32s_linear_infinite] whitespace-nowrap [font-family:var(--font-anton)] text-lg font-normal tracking-[0.04em]">
        {[...items, ...items].map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className="mx-5 inline-flex items-center gap-3"
          >
            {item}
            <span className="text-xs opacity-60">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

type HomeCoursesProps = {
  brand: string;
};

export function HomeCourses({ brand }: HomeCoursesProps) {
  const headingClass =
    "[font-family:var(--font-anton)] font-normal tracking-[0.01em]";

  return (
    <section id="kursy" className="py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <div className="inline-block rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs uppercase tracking-[0.16em] text-red-600">
            Oferta
          </div>
          <h2 className={`mt-4 text-5xl ${headingClass}`}>Nasze kursy</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg font-medium text-stone-600">
            Oferta ośrodka {brand}. Wszystko czego potrzebujesz do zdobycia
            prawa jazdy kategorii B.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr_1fr]">
          <article className="rounded-3xl border border-red-200 bg-white p-10 shadow-[0_8px_32px_rgba(232,54,58,0.18)]">
            <span className="inline-block rounded-full bg-red-600 px-4 py-1 text-xs uppercase tracking-[0.06em] text-white">
              Kategoria B
            </span>
            <div className="mt-5 text-4xl">🚗</div>
            <h3 className={`mt-3 text-4xl ${headingClass}`}>
              Samochód osobowy
            </h3>
            <p className="mt-3 text-base font-medium text-stone-600">
              Kompletny kurs prawa jazdy kat. B. Teoria online, praktyka z
              certyfikowanym instruktorem.
            </p>
          </article>
          <article className="rounded-3xl border border-stone-200 bg-white p-10 shadow-sm">
            <div className="text-4xl">📋</div>
            <h3 className={`mt-3 text-4xl ${headingClass}`}>Teoria online</h3>
            <p className="mt-3 text-base font-medium text-stone-600">
              Ucz się kiedy chcesz — platforma dostępna 24/7 na każdym
              urządzeniu.
            </p>
          </article>
          <article className="rounded-3xl border border-stone-200 bg-white p-10 shadow-sm">
            <div className="text-4xl">🛣️</div>
            <h3 className={`mt-3 text-4xl ${headingClass}`}>
              Jazdy praktyczne
            </h3>
            <p className="mt-3 text-base font-medium text-stone-600">
              Nowoczesna flota pojazdów, elastyczne terminy i dedykowany
              instruktor.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export function HomeInstructors() {
  const headingClass =
    "[font-family:var(--font-anton)] font-normal tracking-[0.01em]";
  const instructors = [
    ["Marek Kowalski", "MK", "var(--accent)", "8 lat doświadczenia"],
    ["Anna Nowak", "AN", "var(--c2)", "5 lat doświadczenia"],
    ["Piotr Wiśniewski", "PW", "var(--c3)", "11 lat doświadczenia"],
    ["Katarzyna Zając", "KZ", "var(--c4)", "4 lata doświadczenia"],
  ];

  return (
    <section id="instruktorzy" className="py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <div className="inline-block rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs uppercase tracking-[0.16em] text-red-600">
            Zespół
          </div>
          <h2 className={`mt-4 text-5xl ${headingClass}`}>Nasi instruktorzy</h2>
        </div>
        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
          {instructors.map(([name, initials, color, badge], idx) => (
            <article
              key={name}
              className="rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm"
            >
              <span className="float-right [font-family:var(--font-anton)] text-5xl font-normal text-black/5">
                0{idx + 1}
              </span>
              <div
                className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
                style={{ background: color }}
              >
                {initials}
              </div>
              <p className="text-lg font-medium">{name}</p>
              <p className="text-sm text-stone-500">Instruktor · Kategoria B</p>
              <p className="mt-3 text-red-600">★★★★★</p>
              <span className="mt-4 inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs text-red-600">
                {badge}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomePricing() {
  const headingClass =
    "[font-family:var(--font-anton)] font-normal tracking-[0.01em]";
  const cards = [
    [
      "Podstawowy",
      "2200",
      ["30h teorii online", "30h jazd praktycznych", "Materiały dydaktyczne"],
      false,
    ],
    [
      "Premium",
      "2800",
      [
        "Wszystko z Podstawowego",
        "5h jazd dodatkowych",
        "Egzamin próbny",
        "Jazda nocna",
      ],
      true,
    ],
    [
      "Intensywny",
      "3400",
      [
        "Wszystko z Premium",
        "Kurs w 3 tygodnie",
        "Dedykowany instruktor",
        "Gwarancja zdania*",
      ],
      false,
    ],
  ] as const;

  return (
    <section id="cennik" className="bg-[#e8eaf2] py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <div className="inline-block rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs uppercase tracking-[0.16em] text-red-600">
            Cennik
          </div>
          <h2 className={`mt-4 text-5xl ${headingClass}`}>Przejrzyste ceny</h2>
        </div>
        <div className="grid overflow-hidden rounded-3xl shadow-2xl lg:grid-cols-3">
          {cards.map(([name, price, features, featured]) => (
            <article
              key={name}
              className={`border-r border-stone-200 bg-white p-12 text-center last:border-r-0 ${featured ? "bg-linear-to-br from-white to-red-50/60" : ""}`}
            >
              {featured ? (
                <span className="mb-4 inline-flex rounded-full bg-red-600 px-4 py-1 text-xs uppercase text-white">
                  Polecany
                </span>
              ) : null}
              <h3 className="[font-family:var(--font-anton)] text-2xl font-normal tracking-[0.04em] text-stone-500">
                {name}
              </h3>
              <p className="mt-4 [font-family:var(--font-anton)] text-7xl font-normal leading-none">
                {price}
                <span className="text-2xl text-stone-500">zł</span>
              </p>
              <ul className="mt-8 space-y-3 text-left text-sm text-stone-500">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="pl-5 relative before:absolute before:left-0 before:content-['✓'] before:text-emerald-600"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

type HomeFooterProps = {
  brand: string;
  locations: readonly string[];
  phones: readonly string[];
};

export function HomeFooter({ brand, locations, phones }: HomeFooterProps) {
  return (
    <footer
      id="kontakt"
      className="border-t-4 border-red-600 bg-linear-to-br from-stone-900 via-stone-900 to-stone-950 pt-16 text-white/80"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 pb-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <div className="text-2xl font-semibold tracking-tight text-white">
            {brand}
          </div>
          <p className="mt-4 text-sm text-white/55">
            Lokalny ośrodek szkolenia kierowców.
            <br />
            Uczymy bezpiecznie, skutecznie i z pasją.
          </p>
        </div>
        <div>
          <h4 className="mb-5 text-xs uppercase tracking-widest text-white/45">
            Nawigacja
          </h4>
          <ul className="space-y-2 text-sm text-white/65">
            <li>
              <a href="#kursy">Kursy</a>
            </li>
            <li>
              <a href="#instruktorzy">Instruktorzy</a>
            </li>
            <li>
              <a href="#cennik">Cennik</a>
            </li>
            <li>
              <a href="#kontakt">Kontakt</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-5 text-xs uppercase tracking-widest text-white/45">
            Kontakt
          </h4>
          <ul className="space-y-2 text-sm text-white/65">
            <li>{locations.join(" · ")}</li>
            <li>tel. {phones[0]}</li>
            <li>tel. {phones[1]}</li>
            <li>Pon-Sob: 8:00-20:00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © 2026 {brand}. Wszelkie prawa zastrzeżone.
      </div>
    </footer>
  );
}
