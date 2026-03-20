import { Button } from "@/components/ui/button";

type DocumentSubmitButtonProps = {
  isLoading: boolean;
};

export function DocumentSubmitButton({ isLoading }: DocumentSubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? "Wysyłanie..." : "Zakończ rejestrację"}
    </Button>
  );
}
