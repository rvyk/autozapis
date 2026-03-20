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

  const all = [...basic, ...specialist];

  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }

  return all;
}
