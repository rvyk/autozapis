import { Button } from "@/components/ui/button";

type ProfileSubmitButtonProps = {
  disabled: boolean;
  isSaving: boolean;
  isAborting: boolean;
  onAbort: () => void;
};

export function ProfileSubmitButton({
  disabled,
  isSaving,
  isAborting,
  onAbort,
}: ProfileSubmitButtonProps) {
  return (
    <div className="space-y-2">
      <Button type="submit" className="w-full" disabled={disabled || isAborting}>
        {isSaving ? "Zapisywanie..." : "Przejdź do wysłania PKK"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
        disabled={disabled || isAborting}
        onClick={onAbort}
      >
        {isAborting ? "Usuwanie konta..." : "Przerwij i usuń konto"}
      </Button>
    </div>
  );
}
