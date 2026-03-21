import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type LicenseFormData = {
  lastName: string;
  firstName: string;
  trainingCategory: "A" | "B";
  birthDay: string;
  birthMonth: string;
  birthYear: string;
};

type LicenseFormFieldsProps = {
  formData: LicenseFormData;
  setFormData: React.Dispatch<React.SetStateAction<LicenseFormData>>;
  errors?: {
    lastName?: string;
    firstName?: string;
    trainingCategory?: string;
    birthDate?: string;
  };
};

const MONTH_NAMES = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
] as const;

export function LicenseFormFields({
  formData,
  setFormData,
  errors,
}: LicenseFormFieldsProps) {
  const selectedCategory = formData.trainingCategory === "A" ? "B" : formData.trainingCategory;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Field className="space-y-2">
        <FieldLabel>Nazwisko</FieldLabel>
        <Input
          value={formData.lastName}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              lastName: e.target.value,
            }))
          }
          placeholder="Kowalski"
          autoComplete="family-name"
          required
          aria-invalid={Boolean(errors?.lastName)}
          className={errors?.lastName ? "border-red-300 focus-visible:ring-red-500/30" : ""}
        />
        {errors?.lastName ? <p className="text-sm text-red-600">{errors.lastName}</p> : null}
      </Field>

      <Field className="space-y-2">
        <FieldLabel>Imię</FieldLabel>
        <Input
          value={formData.firstName}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              firstName: e.target.value,
            }))
          }
          placeholder="Jan"
          autoComplete="given-name"
          required
          aria-invalid={Boolean(errors?.firstName)}
          className={errors?.firstName ? "border-red-300 focus-visible:ring-red-500/30" : ""}
        />
        {errors?.firstName ? <p className="text-sm text-red-600">{errors.firstName}</p> : null}
      </Field>

      <Field className="space-y-2 sm:col-span-3">
        <FieldLabel>Kategoria kursu</FieldLabel>
        <select
          value={selectedCategory}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              trainingCategory: e.target.value as "A" | "B",
            }))
          }
          required
          className="flex h-10 w-full appearance-none rounded-xl border border-stone-300 bg-background px-3 py-2 text-sm text-foreground transition-colors duration-150 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="B">Kategoria B</option>
          <option value="A" disabled>
            Kategoria A (wkrótce)
          </option>
        </select>
        {errors?.trainingCategory ? (
          <p className="text-sm text-red-600">{errors.trainingCategory}</p>
        ) : null}
      </Field>

      <Field className="space-y-2 sm:col-span-3">
        <FieldLabel>Data urodzenia</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={formData.birthDay}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, birthDay: e.target.value }))
            }
            required
            className="flex h-10 w-full appearance-none rounded-xl border border-stone-300 bg-background px-3 py-2 text-sm text-foreground transition-colors duration-150 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>
              Dzień
            </option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={String(d).padStart(2, "0")}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={formData.birthMonth}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                birthMonth: e.target.value,
              }))
            }
            required
            className="flex h-10 w-full appearance-none rounded-xl border border-stone-300 bg-background px-3 py-2 text-sm text-foreground transition-colors duration-150 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>
              Miesiąc
            </option>
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={String(i + 1).padStart(2, "0")}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={formData.birthYear}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                birthYear: e.target.value,
              }))
            }
            required
            className="flex h-10 w-full appearance-none rounded-xl border border-stone-300 bg-background px-3 py-2 text-sm text-foreground transition-colors duration-150 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>
              Rok
            </option>
            {Array.from(
              { length: 71 },
              (_, i) => new Date().getFullYear() - 17 - i,
            ).map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>
        {errors?.birthDate ? <p className="text-sm text-red-600">{errors.birthDate}</p> : null}
      </Field>
    </div>
  );
}

export type { LicenseFormData };
