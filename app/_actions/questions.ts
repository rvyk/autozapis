"use server";

import { prisma } from "@/lib/prisma";

export type QuestionFromDb = {
  id: string;
  questionId: number;
  content: string;
  ansA: string | null;
  ansB: string | null;
  ansC: string | null;
  correctAnswer: string;
  categories: string;
  scope: string | null;
  points: number | null;
};

export async function getRandomQuestions(
  limit = 1,
  category = "B",
): Promise<QuestionFromDb[]> {
  const categoryLike = `%${category}%`;

  return prisma.$queryRaw<QuestionFromDb[]>`
    SELECT id, "questionId", content, "ansA", "ansB", "ansC", "correctAnswer", categories, scope, points
    FROM "Question"
    WHERE categories LIKE ${categoryLike}
    ORDER BY RANDOM()
    LIMIT ${limit}
  `;
}

export async function getExamQuestions(
  category = "B",
): Promise<QuestionFromDb[]> {
  const categoryLike = `%${category}%`;

  const basic = await prisma.$queryRaw<QuestionFromDb[]>`
    SELECT id, "questionId", content, "ansA", "ansB", "ansC", "correctAnswer", categories, scope, points
    FROM "Question"
    WHERE categories LIKE ${categoryLike}
      AND scope = 'PODSTAWOWY'
    ORDER BY RANDOM()
    LIMIT 20
  `;

  const specialist = await prisma.$queryRaw<QuestionFromDb[]>`
    SELECT id, "questionId", content, "ansA", "ansB", "ansC", "correctAnswer", categories, scope, points
    FROM "Question"
    WHERE categories LIKE ${categoryLike}
      AND scope = 'SPECJALISTYCZNY'
    ORDER BY RANDOM()
    LIMIT 12
  `;

  return [
    ...basic.map((q) => ({ ...q, points: 2 })),
    ...specialist.map((q) => ({ ...q, points: 3 })),
  ];
}
