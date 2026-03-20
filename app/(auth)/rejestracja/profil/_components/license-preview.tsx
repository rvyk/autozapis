import Image from "next/image";

type LicenseFormData = {
  lastName: string;
  firstName: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
};

type LicensePreviewProps = {
  formData: LicenseFormData;
  formattedBirthDate: string;
};

export function LicensePreview({
  formData,
  formattedBirthDate,
}: LicensePreviewProps) {
  const hasBirthDate =
    Boolean(formData.birthDay) ||
    Boolean(formData.birthMonth) ||
    Boolean(formData.birthYear);

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-widest text-stone-400">
        Podgląd na żywo
      </p>
      <div className="animate-license-glow overflow-hidden rounded-2xl border border-red-200/60 bg-white p-1.5 sm:p-2.5">
        <div className="relative aspect-1303/819 w-full overflow-hidden rounded-xl">
          <Image
            src="/prawojazdy.jpg"
            alt="Podgląd prawa jazdy"
            fill
            sizes="(max-width: 1024px) 100vw, 920px"
            className="object-cover"
            priority
          />

          <span
            className="absolute left-[36%] top-[20.5%] w-[28%] truncate text-[clamp(9px,1.2vw,14px)] font-bold uppercase tracking-wide text-stone-900 drop-shadow-[0_0_3px_rgba(255,255,255,0.9)]"
            aria-hidden
          >
            {formData.lastName || (
              <span className="text-stone-400/50 font-normal normal-case italic">
                Nazwisko
              </span>
            )}
          </span>

          <span
            className="absolute left-[36%] top-[27%] w-[28%] truncate text-[clamp(9px,1.2vw,14px)] font-bold uppercase tracking-wide text-stone-900 drop-shadow-[0_0_3px_rgba(255,255,255,0.9)]"
            aria-hidden
          >
            {formData.firstName || (
              <span className="text-stone-400/50 font-normal normal-case italic">
                Imię
              </span>
            )}
          </span>

          <span
            className="absolute left-[36%] top-[33.5%] w-[28%] truncate text-[clamp(9px,1.2vw,14px)] font-semibold tabular-nums text-stone-900 drop-shadow-[0_0_3px_rgba(255,255,255,0.9)]"
            aria-hidden
          >
            {hasBirthDate ? (
              formattedBirthDate
            ) : (
              <span className="text-stone-400/50 font-normal italic">
                DD.MM.RRRR
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
