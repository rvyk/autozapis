"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getRandomQuestions } from "@/app/_actions/questions";

type Question = {
  id: string;
  questionId: number;
  content: string;
  ansA: string | null;
  ansB: string | null;
  ansC: string | null;
  correctAnswer: string;
  scope: string | null;
  points: number | null;
};

export function CwiczeniaClient({
  initialQuestion,
  category,
}: {
  initialQuestion: Question;
  category: string;
}) {
  const [question, setQuestion] = useState<Question>(initialQuestion);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isPending, startTransition] = useTransition();

  const isCorrect = selectedAnswer === question.correctAnswer;
  const isTrueFalse = question.ansA === null || question.ansB === null;

  function handleAnswer(ans: string) {
    if (isAnswered) return;
    setSelectedAnswer(ans);
    setIsAnswered(true);
    setScore((prev) => ({
      correct: prev.correct + (ans === question.correctAnswer ? 1 : 0),
      total: prev.total + 1,
    }));
  }

  function loadNext() {
    startTransition(async () => {
      const next = await getRandomQuestions(1, category);
      if (next.length > 0) {
        setQuestion(next[0]);
        setSelectedAnswer(null);
        setIsAnswered(false);
      }
    });
  }

  function getAnswerButtonClass(ans: string) {
    if (!isAnswered) {
      return selectedAnswer === ans
        ? "border-stone-400 bg-stone-100"
        : "border-stone-200 hover:bg-stone-50";
    }

    if (ans === question.correctAnswer) {
      return "border-green-300 bg-green-50";
    }

    if (ans === selectedAnswer && ans !== question.correctAnswer) {
      return "border-red-300 bg-red-50";
    }

    return "border-stone-200 opacity-50";
  }

  function getAnswerLabelClass(ans: string) {
    if (!isAnswered) {
      return "bg-stone-100 text-stone-600";
    }

    if (ans === question.correctAnswer) {
      return "bg-green-100 text-green-700";
    }

    if (ans === selectedAnswer && ans !== question.correctAnswer) {
      return "bg-red-100 text-red-700";
    }

    return "bg-stone-100 text-stone-400";
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-stone-500">
          Pytanie #{question.questionId}
        </span>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600">
          Wynik: {score.correct}/{score.total}
        </span>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold leading-relaxed text-stone-900">
          {question.content}
        </h2>

        {!isTrueFalse ? (
          <div className="flex flex-col gap-3">
            {(["A", "B", "C"] as const).map((ans) => {
              const text = ans === "A" ? question.ansA : ans === "B" ? question.ansB : question.ansC;
              if (!text) return null;

              return (
                <button
                  key={ans}
                  type="button"
                  onClick={() => handleAnswer(ans)}
                  disabled={isAnswered}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition-colors",
                    getAnswerButtonClass(ans),
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                      getAnswerLabelClass(ans),
                    )}
                  >
                    {ans}
                  </span>
                  <span className="text-stone-800">{text}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {(["T", "N"] as const).map((ans) => (
              <button
                key={ans}
                type="button"
                onClick={() => handleAnswer(ans)}
                disabled={isAnswered}
                className={cn(
                  "rounded-xl border p-4 text-center text-lg font-semibold transition-colors",
                  getAnswerButtonClass(ans),
                )}
              >
                <span className={cn("mr-2 text-xs font-bold", getAnswerLabelClass(ans))}>
                  {ans === "T" ? "TAK" : "NIE"}
                </span>
              </button>
            ))}
          </div>
        )}

        {isAnswered && (
          <div
            className={cn(
              "mt-4 rounded-xl border p-4",
              isCorrect
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50",
            )}
          >
            <p
              className={cn(
                "text-sm font-semibold",
                isCorrect ? "text-green-800" : "text-red-800",
              )}
            >
              {isCorrect ? "Poprawna odpowiedź!" : "Błędna odpowiedź"}
            </p>
            {!isCorrect && (
              <p className="mt-1 text-sm text-red-700">
                Prawidłowa odpowiedź: <strong>{question.correctAnswer}</strong>
              </p>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          {isAnswered && (
            <Button onClick={loadNext} disabled={isPending} size="lg">
              {isPending ? "Ładowanie..." : "Następne pytanie"}
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <a
          href="/kursant/materialy"
          className="text-sm text-stone-500 underline underline-offset-2 hover:text-stone-700"
        >
          Powrót do materiałów
        </a>
      </div>
    </div>
  );
}
