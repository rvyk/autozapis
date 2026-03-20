import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type RegistrationFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
  emailError?: string;
  passwordError?: string;
  isLoading: boolean;
};

export function RegistrationForm({
  onSubmit,
  emailError,
  passwordError,
  isLoading,
}: RegistrationFormProps) {
  return (
    <form action={onSubmit} className="space-y-4">
      <Field className="space-y-2">
        <FieldLabel>Email</FieldLabel>
        <Input
          name="email"
          type="email"
          placeholder="jan@example.com"
          autoComplete="email"
        />
        {emailError && <FieldError>{emailError}</FieldError>}
      </Field>

      <Field className="space-y-2">
        <FieldLabel>Hasło</FieldLabel>
        <Input name="password" type="password" autoComplete="new-password" />
        {passwordError && <FieldError>{passwordError}</FieldError>}
      </Field>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Tworzenie konta..." : "Przejdź dalej"}
      </Button>
    </form>
  );
}
