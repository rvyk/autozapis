type ClerkErrorEntry = {
  code?: string;
  message?: string;
  shortMessage?: string;
  longMessage?: string;
  field?: string;
  paramName?: string;
  name?: string;
  meta?: unknown;
};

type LoginSubmitErrors = {
  globalError?: string;
  identifierError?: string;
  passwordError?: string;
};

type RegistrationSubmitErrors = {
  globalError?: string;
  emailError?: string;
  phoneError?: string;
  passwordError?: string;
};

const MESSAGE_BY_CODE: Record<string, string> = {
  captcha_invalid:
    "Weryfikacja zabezpieczeń nie powiodła się. Odśwież stronę i spróbuj ponownie.",
  captcha_missing_token:
    "Brak tokenu CAPTCHA. Odśwież stronę i spróbuj ponownie.",
  form_code_incorrect: "Podany kod jest niepoprawny.",
  form_identifier_exists: "To konto już istnieje. Spróbuj się zalogować.",
  form_identifier_not_found: "Nie znaleziono konta z podanym adresem e-mail.",
  form_param_format_invalid: "Wprowadzone dane mają nieprawidłowy format.",
  form_param_missing: "Wypełnij wymagane pola i spróbuj ponownie.",
  form_password_incorrect: "Niepoprawne hasło. Spróbuj ponownie.",
  form_password_length_too_short: "Hasło jest za krótkie.",
  form_password_no_lowercase: "Hasło musi zawierać małą literę.",
  form_password_no_number: "Hasło musi zawierać cyfrę.",
  form_password_no_special_char: "Hasło musi zawierać znak specjalny.",
  form_password_no_uppercase: "Hasło musi zawierać wielką literę.",
  form_password_not_strong_enough: "Hasło jest zbyt słabe.",
  form_password_or_identifier_incorrect:
    "Niepoprawny e-mail lub hasło. Spróbuj ponownie.",
  identifier_exists: "To konto już istnieje. Spróbuj się zalogować.",
  not_allowed_access: "Dostęp dla podanych danych jest zablokowany.",
  sign_up_mode_restricted: "Nowe rejestracje są obecnie ograniczone.",
  sign_up_restricted_waitlist:
    "Rejestracja jest chwilowo niedostępna. Dołącz do listy oczekujących.",
  signup_rate_limit_exceeded:
    "Przekroczono limit prób rejestracji. Spróbuj ponownie za chwilę.",
  user_locked: "Konto jest tymczasowo zablokowane po wielu nieudanych próbach.",
};

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  return value as Record<string, unknown>;
}

function parseMeta(meta: unknown): Record<string, unknown> | null {
  if (!meta) {
    return null;
  }

  if (typeof meta === "string") {
    try {
      const parsed = JSON.parse(meta);
      return asObject(parsed);
    } catch {
      return null;
    }
  }

  return asObject(meta);
}

function extractEntries(value: unknown): ClerkErrorEntry[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => extractEntries(item));
  }

  const record = asObject(value);
  if (!record) {
    return [];
  }

  if (record.error) {
    return extractEntries(record.error);
  }

  if (record.errors) {
    return extractEntries(record.errors);
  }

  const entry = value as ClerkErrorEntry;
  if (entry.code || entry.message || entry.shortMessage || entry.longMessage) {
    return [entry];
  }

  return [];
}

function resolveField(entry: ClerkErrorEntry): string | null {
  const meta = parseMeta(entry.meta);
  const raw =
    entry.field ??
    entry.paramName ??
    entry.name ??
    (typeof meta?.name === "string" ? meta.name : undefined);

  if (!raw) {
    return null;
  }

  const normalized = raw.replace(/[_-]/g, "").toLowerCase();

  if (
    normalized === "identifier" ||
    normalized === "email" ||
    normalized === "emailaddress"
  ) {
    return "email";
  }

  if (normalized === "password") {
    return "password";
  }

  if (normalized === "phone" || normalized === "phonenumber") {
    return "phone";
  }

  if (normalized === "code") {
    return "code";
  }

  return raw;
}

function localizeEntry(entry: ClerkErrorEntry): string {
  if (entry.code && MESSAGE_BY_CODE[entry.code]) {
    return MESSAGE_BY_CODE[entry.code];
  }

  const message = entry.longMessage ?? entry.message ?? entry.shortMessage;
  if (!message) {
    return "Wystąpił błąd. Spróbuj ponownie.";
  }

  const normalized = message.toLowerCase();
  if (normalized.includes("already exists")) {
    return "To konto już istnieje. Spróbuj się zalogować.";
  }
  if (normalized.includes("incorrect")) {
    return "Wprowadzone dane są niepoprawne.";
  }
  if (normalized.includes("rate limit")) {
    return "Przekroczono limit prób. Spróbuj ponownie za chwilę.";
  }
  if (normalized.includes("expired")) {
    return "Dane wygasły. Spróbuj ponownie.";
  }

  return message;
}

export function mapLoginClerkError(error: unknown): LoginSubmitErrors {
  const entries = extractEntries(error);
  const mapped: LoginSubmitErrors = {};

  for (const entry of entries) {
    const field = resolveField(entry);
    const message = localizeEntry(entry);

    if ((field === "email" || field === "identifier") && !mapped.identifierError) {
      mapped.identifierError = message;
      continue;
    }

    if (field === "password" && !mapped.passwordError) {
      mapped.passwordError = message;
      continue;
    }

    if (!mapped.globalError) {
      mapped.globalError = message;
    }
  }

  if (!mapped.globalError && !mapped.identifierError && !mapped.passwordError) {
    mapped.globalError = "Nie udało się zalogować. Spróbuj ponownie.";
  }

  return mapped;
}

export function mapRegistrationClerkError(error: unknown): RegistrationSubmitErrors {
  const entries = extractEntries(error);
  const mapped: RegistrationSubmitErrors = {};

  for (const entry of entries) {
    const field = resolveField(entry);
    const message = localizeEntry(entry);

    if (field === "email" && !mapped.emailError) {
      mapped.emailError = message;
      continue;
    }

    if (field === "phone" && !mapped.phoneError) {
      mapped.phoneError = message;
      continue;
    }

    if (field === "password" && !mapped.passwordError) {
      mapped.passwordError = message;
      continue;
    }

    if (!mapped.globalError) {
      mapped.globalError = message;
    }
  }

  if (!mapped.globalError && !mapped.emailError && !mapped.phoneError && !mapped.passwordError) {
    mapped.globalError = "Nie udało się utworzyć konta. Spróbuj ponownie.";
  }

  return mapped;
}
