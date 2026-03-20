import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type LoginFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
  identifierError?: string;
  passwordError?: string;
  isLoading: boolean;
};

export function LoginForm({
  onSubmit,
  identifierError,
  passwordError,
  isLoading,
}: LoginFormProps) {
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
        {identifierError && <FieldError>{identifierError}</FieldError>}
      </Field>

      <Field className="space-y-2">
        <FieldLabel>Hasło</FieldLabel>
        <Input name="password" type="password" autoComplete="current-password" />
        {passwordError && <FieldError>{passwordError}</FieldError>}
      </Field>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logowanie..." : "Zaloguj się"}
      </Button>
    </form>
  );
}
