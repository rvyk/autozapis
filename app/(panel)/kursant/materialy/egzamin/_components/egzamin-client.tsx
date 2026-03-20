"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  questionId: number;
  content: string;
  ansA: string | null;
  ansB: string | null;
  ansC: string | null;
  correctAnswer: string;
}

export function EgzaminClient({
  initialQuestions,
}: {
  initialQuestions: Question[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [isFinished, setIsFinished] = useState(false);

  const q = initialQuestions[currentIndex];

  const handleAnswer = (ans: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: ans }));
  };

  const handleNext = () => {
    if (currentIndex < initialQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    let score = 0;
    initialQuestions.forEach((question, idx) => {
      if (selectedAnswers[idx] === question.correctAnswer) {
        score++;
      }
    });

    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-stone-900">Koniec Egzaminu!</h2>
        <p className="mt-4 text-lg text-stone-600">
          Twój wynik: {score} / {initialQuestions.length}
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => window.location.reload()}
            size="lg"
            className="px-8"
          >
            Spróbuj ponownie
          </Button>
        </div>
      </div>
    );
  }

  const isSelected = selectedAnswers[currentIndex] !== undefined;

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between text-sm font-medium text-stone-500">
        <span className="bg-stone-100 px-3 py-1 rounded-full">
          Pytanie {currentIndex + 1} z {initialQuestions.length}
        </span>
        <span>ID Pytańia (PWPW): {q.questionId}</span>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm min-h-100 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold text-stone-900 leading-relaxed mb-8">
            {q.content}
          </h2>

          <div className="flex flex-col gap-3">
            {q.ansA !== null && q.ansB !== null ? (
              // Wielo-krotnego wyboru (A, B, C)
              <>
                <Button
                  variant={
                    selectedAnswers[currentIndex] === "A"
                      ? "primary"
                      : "outline"
                  }
                  className="justify-start h-auto p-4 text-left font-normal"
                  onClick={() => handleAnswer("A")}
                >
                  <span className="font-bold mr-3 w-6 text-center text-red-600 bg-red-100 rounded-md py-0.5">
                    A
                  </span>{" "}
                  {q.ansA}
                </Button>
                <Button
                  variant={
                    selectedAnswers[currentIndex] === "B"
                      ? "primary"
                      : "outline"
                  }
                  className="justify-start h-auto p-4 text-left font-normal"
                  onClick={() => handleAnswer("B")}
                >
                  <span className="font-bold mr-3 w-6 text-center text-red-600 bg-red-100 rounded-md py-0.5">
                    B
                  </span>{" "}
                  {q.ansB}
                </Button>
                {q.ansC && (
                  <Button
                    variant={
                      selectedAnswers[currentIndex] === "C"
                        ? "primary"
                        : "outline"
                    }
                    className="justify-start h-auto p-4 text-left font-normal"
                    onClick={() => handleAnswer("C")}
                  >
                    <span className="font-bold mr-3 w-6 text-center text-red-600 bg-red-100 rounded-md py-0.5">
                      C
                    </span>{" "}
                    {q.ansC}
                  </Button>
                )}
              </>
            ) : (
              // Prawda / Fałsz (T / N)
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={
                    selectedAnswers[currentIndex] === "T"
                      ? "primary"
                      : "outline"
                  }
                  className="h-16 text-lg"
                  onClick={() => handleAnswer("T")}
                >
                  TAK
                </Button>
                <Button
                  variant={
                    selectedAnswers[currentIndex] === "N"
                      ? "primary"
                      : "outline"
                  }
                  className="h-16 text-lg"
                  onClick={() => handleAnswer("N")}
                >
                  NIE
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            disabled={!isSelected}
            onClick={handleNext}
            size="lg"
            className="w-full sm:w-auto px-8"
          >
            Dalej
          </Button>
        </div>
      </div>
    </div>
  );
}
