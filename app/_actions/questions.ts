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
};

export async function getRandomQuestions(
  limit = 10,
  category = "B",
): Promise<QuestionFromDb[]> {
  const categoryLike = `%${category}%`;

  return prisma.$queryRaw<QuestionFromDb[]>`
    SELECT id, "questionId", content, "ansA", "ansB", "ansC", "correctAnswer", categories
    FROM "Question"
    WHERE categories LIKE ${categoryLike}
    ORDER BY RANDOM()
    LIMIT ${limit}
  `;
}
