import { getRandomQuestions } from "@/app/_actions/questions";
import { CwiczeniaClient } from "./_components/cwiczenia-client";

export default async function CwiczeniaPage({
  searchParams,
}: {
  searchParams: Promise<{ kat?: string }>;
}) {
  const params = await searchParams;
  const category = params.kat === "A" ? "A" : "B";
  const questions = await getRandomQuestions(1, category);

  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold tracking-tight text-stone-900">
        Ćwiczenia — kat. {category}
      </h1>

      {questions.length === 0 ? (
        <p>Brak pytań w bazie — musisz je najpierw zasiać u administratora.</p>
      ) : (
        <CwiczeniaClient initialQuestion={questions[0]} category={category} />
      )}
    </div>
  );
}
