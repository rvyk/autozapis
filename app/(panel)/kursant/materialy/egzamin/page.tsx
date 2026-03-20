import { getExamQuestions } from "@/app/_actions/questions";
import { EgzaminClient } from "./_components/egzamin-client";

export default async function EgzaminPage({
  searchParams,
}: {
  searchParams: Promise<{ kat?: string }>;
}) {
  const params = await searchParams;
  const category = params.kat === "A" ? "A" : "B";
  const questions = await getExamQuestions(category);

  if (questions.length < 32) {
    return (
      <div className="flex w-full flex-col gap-6 p-4">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Egzamin Próbny — kat. {category}
        </h1>
        <p className="text-stone-500">
          Brak wystarczającej liczby pytań w bazie (znaleziono {questions.length}/32).
          Administrator musi dodać więcej pytań.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <EgzaminClient initialQuestions={questions} category={category} />
    </div>
  );
}
