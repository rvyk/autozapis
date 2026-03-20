import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type DocumentUploadFieldProps = {
  maxSizeMb: number;
  fileName: string | null;
  error: string | null;
  onFileChange: (fileName: string | null) => void;
};

export function DocumentUploadField({
  maxSizeMb,
  fileName,
  error,
  onFileChange,
}: DocumentUploadFieldProps) {
  return (
    <Field className="space-y-2">
      <FieldLabel>Plik dokumentu</FieldLabel>

      <label className="group flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-red-200 bg-red-50/30 px-6 py-8 transition-all hover:border-red-400 hover:bg-red-50/60">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 transition-transform group-hover:scale-110">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>
        <div className="text-center">
          {fileName ? (
            <p className="text-sm font-medium text-stone-900">{fileName}</p>
          ) : (
            <>
              <p className="text-sm font-medium text-stone-700">
                Kliknij, aby wybrać plik
              </p>
              <p className="mt-1 text-xs text-stone-400">
                PDF, JPG, PNG lub WEBP - maks. {maxSizeMb} MB
              </p>
            </>
          )}
        </div>
        <Input
          name="file"
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          required
          className="hidden"
          onChange={(e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            onFileChange(file?.name ?? null);
          }}
        />
      </label>

      <FieldDescription>
        Dopuszczalne formaty: PDF, JPG, PNG, WEBP. Maks. {maxSizeMb} MB.
      </FieldDescription>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
