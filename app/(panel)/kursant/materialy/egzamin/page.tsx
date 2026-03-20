import { getRandomQuestions } from "@/app/_actions/questions";
import { EgzaminClient } from "./_components/egzamin-client";

export default async function EgzaminPage({
  searchParams,
}: {
  searchParams: Promise<{ kat?: string }>;
}) {
  const params = await searchParams;
  const category = params.kat === "A" ? "A" : "B";
  const questions = await getRandomQuestions(32, category);

  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold tracking-tight text-stone-900">
        Egzamin Próbny — kat. {category}
      </h1>

      {questions.length === 0 ? (
        <p>Brak pytań w bazie — musisz je najpierw zasiać u administratora.</p>
      ) : (
        <EgzaminClient initialQuestions={questions} />
      )}
    </div>
  );
}
