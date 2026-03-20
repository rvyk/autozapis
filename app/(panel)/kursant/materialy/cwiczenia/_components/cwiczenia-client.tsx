"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
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

function getScopeLabel(scope: string | null) {
  if (scope === "PODSTAWOWY") return "Podstawowe";
  if (scope === "SPECJALISTYCZNY") return "Specjalistyczne";
  return "Inne";
}

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

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Ćwiczenia — kat. {category}
          </h1>
          <p className="text-sm text-stone-500">
            Ucz się w swoim tempie, po jednym pytaniu na raz.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white px-5 py-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-stone-900">
            {score.correct}<span className="text-lg text-stone-400">/{score.total}</span>
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
            Wynik
          </p>
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase",
              question.scope === "PODSTAWOWY"
                ? "bg-blue-100 text-blue-700"
                : "bg-purple-100 text-purple-700",
            )}
          >
            {getScopeLabel(question.scope)}
          </span>
          <span className="text-xs text-stone-500">
            {question.points ?? 1} {question.points === 1 ? "punkt" : "punkty"}
          </span>
          <span className="ml-auto text-xs text-stone-400">
            #{question.questionId}
          </span>
        </div>

        <h2 className="mb-6 text-lg font-semibold leading-relaxed text-stone-900">
          {question.content}
        </h2>

        {/* Answers */}
        {!isTrueFalse ? (
          <div className="flex flex-col gap-3">
            {(["A", "B", "C"] as const).map((ans) => {
              const text =
                ans === "A"
                  ? question.ansA
                  : ans === "B"
                    ? question.ansB
                    : question.ansC;
              if (!text) return null;

              let borderClass = "border-stone-200 hover:bg-stone-50";
              let labelClass = "bg-stone-100 text-stone-600";

              if (isAnswered) {
                if (ans === question.correctAnswer) {
                  borderClass = "border-green-300 bg-green-50";
                  labelClass = "bg-green-100 text-green-700";
                } else if (ans === selectedAnswer) {
                  borderClass = "border-red-300 bg-red-50";
                  labelClass = "bg-red-100 text-red-700";
                } else {
                  borderClass = "border-stone-200 opacity-50";
                  labelClass = "bg-stone-100 text-stone-400";
                }
              } else if (selectedAnswer === ans) {
                borderClass = "border-stone-400 bg-stone-100";
              }

              return (
                <button
                  key={ans}
                  type="button"
                  onClick={() => handleAnswer(ans)}
                  disabled={isAnswered}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition-colors",
                    borderClass,
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                      labelClass,
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
            {(["T", "N"] as const).map((ans) => {
              let borderClass = "border-stone-200 hover:bg-stone-50";

              if (isAnswered) {
                if (ans === question.correctAnswer) {
                  borderClass = "border-green-300 bg-green-50 text-green-700";
                } else if (ans === selectedAnswer) {
                  borderClass = "border-red-300 bg-red-50 text-red-700";
                } else {
                  borderClass = "border-stone-200 opacity-50";
                }
              } else if (selectedAnswer === ans) {
                borderClass = "border-stone-400 bg-stone-100";
              }

              return (
                <button
                  key={ans}
                  type="button"
                  onClick={() => handleAnswer(ans)}
                  disabled={isAnswered}
                  className={cn(
                    "rounded-xl border p-4 text-center text-lg font-semibold transition-colors",
                    borderClass,
                  )}
                >
                  {ans === "T" ? "TAK" : "NIE"}
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback */}
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

        {/* Next button */}
        {isAnswered && (
          <div className="mt-6 flex justify-end">
            <Button onClick={loadNext} disabled={isPending} size="lg">
              {isPending ? "Ładowanie..." : "Następne pytanie"}
            </Button>
          </div>
        )}
      </div>

      {/* Back link */}
      <div className="flex justify-center">
        <Link
          href="/kursant/materialy"
          className="text-sm text-stone-500 underline underline-offset-2 hover:text-stone-700"
        >
          Powrót do materiałów
        </Link>
      </div>
    </div>
  );
}
