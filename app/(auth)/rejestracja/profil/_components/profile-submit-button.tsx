import { Button } from "@/components/ui/button";

type ProfileSubmitButtonProps = {
  disabled: boolean;
  isSaving: boolean;
};

export function ProfileSubmitButton({
  disabled,
  isSaving,
}: ProfileSubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={disabled}>
      {isSaving ? "Zapisywanie..." : "Przejdź do wysłania PKK"}
    </Button>
  );
}
