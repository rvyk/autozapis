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

  if (questions.length === 0) {
    return (
      <div className="flex w-full flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Ćwiczenia — kat. {category}
        </h1>
        <p className="text-stone-500">
          Brak pytań w bazie — musisz je najpierw zasiać u administratora.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <CwiczeniaClient initialQuestion={questions[0]} category={category} />
    </div>
  );
}
