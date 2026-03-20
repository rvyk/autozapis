import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

type RawQuestion = {
  lp: number;
  questionId: number;
  content: string;
  ansA: string | null;
  ansB: string | null;
  ansC: string | null;
  correctAnswer: string;
  categories: string;
};

const connectionString = process.env["DATABASE_URL"];

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const filePath = resolve(__dirname, "pwpw_questions.json");
  const raw = readFileSync(filePath, "utf-8");
  const questions: RawQuestion[] = JSON.parse(raw);

  console.log(`Wczytano ${questions.length} pytań z pliku JSON.`);

  let created = 0;
  let updated = 0;

  for (const q of questions) {
    const existing = await prisma.question.findUnique({
      where: { questionId: q.questionId },
    });

    if (existing) {
      await prisma.question.update({
        where: { questionId: q.questionId },
        data: {
          content: q.content,
          ansA: q.ansA,
          ansB: q.ansB,
          ansC: q.ansC,
          correctAnswer: q.correctAnswer,
          categories: q.categories,
        },
      });
      updated += 1;
    } else {
      await prisma.question.create({
        data: {
          questionId: q.questionId,
          content: q.content,
          ansA: q.ansA,
          ansB: q.ansB,
          ansC: q.ansC,
          correctAnswer: q.correctAnswer,
          categories: q.categories,
        },
      });
      created += 1;
    }
  }

  console.log(
    `Seeding zakończony: ${created} utworzonych, ${updated} zaktualizowanych.`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
