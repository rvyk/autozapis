"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

const EXAM_DURATION_SECONDS = 25 * 60;
const PASS_THRESHOLD = 52;

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getScopeLabel(scope: string | null) {
  if (scope === "PODSTAWOWY") return "Podstawowe";
  if (scope === "SPECJALISTYCZNY") return "Specjalistyczne";
  return "Inne";
}

export function EgzaminClient({
  initialQuestions,
  category,
}: {
  initialQuestions: Question[];
  category: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsFinished(true);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function finishExam() {
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function handleAnswer(ans: string) {
    if (isFinished) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: ans }));
  }

  function handleNext() {
    if (currentIndex < initialQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishExam();
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  if (isFinished) {
    let pointsEarned = 0;
    let pointsTotal = 0;
    let correctCount = 0;

    initialQuestions.forEach((q, idx) => {
      const pts = q.points ?? 1;
      pointsTotal += pts;
      if (selectedAnswers[idx] === q.correctAnswer) {
        pointsEarned += pts;
        correctCount += 1;
      }
    });

    const passed = pointsEarned >= PASS_THRESHOLD;

    return (
      <div className="flex w-full flex-col gap-6">
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Egzamin Próbny — kat. {category}
          </h1>

          <div className="mt-6 flex flex-col items-center gap-4 text-center">
            <div
              className={cn(
                "flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold",
                passed
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700",
              )}
            >
              {pointsEarned}
            </div>

            <div>
              <p
                className={cn(
                  "text-lg font-semibold",
                  passed ? "text-green-700" : "text-red-700",
                )}
              >
                {passed ? "Wynik pozytywny!" : "Wynik negatywny"}
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Zdobyto {pointsEarned} z {pointsTotal} punktów (próg: {PASS_THRESHOLD})
              </p>
            </div>

            <div className="mt-2 flex gap-6 text-sm text-stone-600">
              <div className="text-center">
                <p className="text-2xl font-bold text-stone-900">
                  {correctCount}
                </p>
                <p>Poprawnych</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-stone-900">
                  {initialQuestions.length - correctCount}
                </p>
                <p>Błędnych</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-stone-900">
                  {Object.keys(selectedAnswers).length}
                </p>
                <p>Udzielonych</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {initialQuestions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.correctAnswer;
              const wasSkipped = userAns === undefined;

              return (
                <div
                  key={q.id}
                  className={cn(
                    "rounded-xl border p-4",
                    isCorrect
                      ? "border-green-200 bg-green-50/50"
                      : wasSkipped
                        ? "border-amber-200 bg-amber-50/50"
                        : "border-red-200 bg-red-50/50",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-stone-500">
                          {idx + 1}.
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                            q.scope === "PODSTAWOWY"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700",
                          )}
                        >
                          {getScopeLabel(q.scope)}
                        </span>
                        <span className="text-xs text-stone-500">
                          {q.points ?? 1} pkt
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-stone-700">
                        {q.content}
                      </p>
                    </div>
                    <div className="text-right text-xs">
                      {wasSkipped ? (
                        <span className="font-medium text-amber-600">
                          Pominięte
                        </span>
                      ) : isCorrect ? (
                        <span className="font-medium text-green-600">
                          +{q.points ?? 1} pkt
                        </span>
                      ) : (
                        <span className="font-medium text-red-600">
                          0 pkt
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <Link href={`/kursant/materialy/egzamin?kat=${category}`}>
              <Button size="lg">Nowy egzamin</Button>
            </Link>
            <Link href="/kursant/materialy">
              <Button variant="secondary" size="lg">
                Powrót do materiałów
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const q = initialQuestions[currentIndex];
  const isTrueFalse = q.ansA === null || q.ansB === null;
  const answeredCount = Object.keys(selectedAnswers).length;
  const isLowTime = timeLeft <= 60;

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Egzamin Próbny — kat. {category}
          </h1>
          <p className="text-sm text-stone-500">
            20 podstawowych + 12 specjalistycznych
          </p>
        </div>

        <div
          className={cn(
            "rounded-2xl border px-5 py-3 text-center",
            isLowTime
              ? "border-red-300 bg-red-50 animate-pulse"
              : "border-stone-200 bg-white",
          )}
        >
          <p
            className={cn(
              "text-2xl font-bold tabular-nums",
              isLowTime ? "text-red-600" : "text-stone-900",
            )}
          >
            {formatTime(timeLeft)}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
            Pozostały czas
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>
            Pytanie {currentIndex + 1} z {initialQuestions.length}
          </span>
          <span>{answeredCount} udzielonych odpowiedzi</span>
        </div>
        <div className="mt-2 flex gap-1">
          {initialQuestions.map((qq, idx) => (
            <div
              key={qq.id}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                idx === currentIndex
                  ? "bg-red-500"
                  : selectedAnswers[idx] !== undefined
                    ? qq.scope === "PODSTAWOWY"
                      ? "bg-blue-300"
                      : "bg-purple-300"
                    : "bg-stone-200",
              )}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase",
              q.scope === "PODSTAWOWY"
                ? "bg-blue-100 text-blue-700"
                : "bg-purple-100 text-purple-700",
            )}
          >
            {getScopeLabel(q.scope)}
          </span>
          <span className="text-xs text-stone-500">
            {q.points ?? 1} {q.points === 1 ? "punkt" : "punktów"}
          </span>
        </div>

        <h2 className="mb-6 text-lg font-semibold leading-relaxed text-stone-900">
          {q.content}
        </h2>

        <div className="flex flex-col gap-3">
          {!isTrueFalse ? (
            <>
              {(["A", "B", "C"] as const).map((ans) => {
                const text =
                  ans === "A"
                    ? q.ansA
                    : ans === "B"
                      ? q.ansB
                      : q.ansC;
                if (!text) return null;

                return (
                  <button
                    key={ans}
                    type="button"
                    onClick={() => handleAnswer(ans)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition-colors",
                      selectedAnswers[currentIndex] === ans
                        ? "border-red-400 bg-red-50"
                        : "border-stone-200 hover:bg-stone-50",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                        selectedAnswers[currentIndex] === ans
                          ? "bg-red-500 text-white"
                          : "bg-stone-100 text-stone-600",
                      )}
                    >
                      {ans}
                    </span>
                    <span className="text-stone-800">{text}</span>
                  </button>
                );
              })}
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {(["T", "N"] as const).map((ans) => (
                <button
                  key={ans}
                  type="button"
                  onClick={() => handleAnswer(ans)}
                  className={cn(
                    "rounded-xl border p-4 text-center text-lg font-semibold transition-colors",
                    selectedAnswers[currentIndex] === ans
                      ? "border-red-400 bg-red-50 text-red-700"
                      : "border-stone-200 hover:bg-stone-50",
                  )}
                >
                  {ans === "T" ? "TAK" : "NIE"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Poprzednie
        </Button>

        <div className="flex gap-2">
          {currentIndex === initialQuestions.length - 1 ? (
            <Button onClick={finishExam} size="lg">
              Zakończ egzamin
            </Button>
          ) : (
            <Button onClick={handleNext} size="lg">
              Następne
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
