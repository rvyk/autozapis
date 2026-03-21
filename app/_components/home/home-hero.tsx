type HomeHeroProps = {
  videoSrc: string;
  brand: string;
  locations: readonly string[];
};

export function HomeHero({ videoSrc, brand, locations }: HomeHeroProps) {
  const headingClass =
    "[font-family:var(--font-anton)] font-normal tracking-[0.01em] leading-[1.04]";

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-6"
    >
      <video
        key={`${process.env.NEXT_PUBLIC_CDN}/${videoSrc}`}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source
          src={`${process.env.NEXT_PUBLIC_CDN}/${videoSrc}`}
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/45 to-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_0%_100%,rgba(232,54,58,0.28),transparent_60%)]" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-36 pb-20 sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-300/40 bg-red-500/70 px-4 py-1.5 text-xs uppercase tracking-[0.16em] text-white">
          <span className="h-2 w-2 rounded-full bg-white" />
          {brand} · Kategoria B
        </div>
        <h1
          className={`mt-7 max-w-4xl text-6xl text-white sm:text-7xl lg:text-8xl ${headingClass}`}
        >
          <span className="block">ZASIĄDŹ</span>
          <span className="block text-red-500">ZA KIEROWNICĄ</span>
          <span className="block">SWOJEJ PRZYSZŁOŚCI</span>
        </h1>
        <p className="mt-8 max-w-2xl text-xl leading-8 font-medium text-white/90">
          Szkolimy kierowców skutecznie, spokojnie i profesjonalnie. Zajęcia
          prowadzimy w: {locations.join(", ")}.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#kursy"
            className="rounded-lg bg-red-600 px-8 py-4 text-base font-semibold text-white shadow-[0_16px_32px_-14px_rgba(220,38,38,0.95)]"
          >
            Rozpocznij kurs
          </a>
          <a
            href="#cennik"
            className="rounded-lg border border-white/35 bg-white/12 px-8 py-4 text-base font-semibold text-white"
          >
            Poznaj ofertę
          </a>
        </div>
        <div className="mt-14 grid w-full max-w-2xl grid-cols-3 overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
          <div className="px-4 py-4 text-center sm:px-8 sm:py-5">
            <span className="block [font-family:var(--font-anton)] text-3xl font-normal text-white sm:text-5xl">
              2400
            </span>
            <span className="text-[10px] uppercase tracking-[0.06em] text-white/60 sm:text-xs">
              Absolwentów
            </span>
          </div>
          <div className="border-l border-white/20 px-4 py-4 text-center sm:px-8 sm:py-5">
            <span className="block [font-family:var(--font-anton)] text-3xl font-normal text-white sm:text-5xl">
              97%
            </span>
            <span className="text-[10px] uppercase tracking-[0.06em] text-white/60 sm:text-xs">
              Zdawalność
            </span>
          </div>
          <div className="border-l border-white/20 px-4 py-4 text-center sm:px-8 sm:py-5">
            <span className="block [font-family:var(--font-anton)] text-3xl font-normal text-white sm:text-5xl">
              12
            </span>
            <span className="text-[10px] uppercase tracking-[0.06em] text-white/60 sm:text-xs">
              Lat doświadczenia
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
