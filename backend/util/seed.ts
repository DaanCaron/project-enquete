import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const main = async () => {
    await prisma.answer.deleteMany();
    await prisma.button.deleteMany();
    await prisma.text.deleteMany();
    await prisma.question.deleteMany();
    await prisma.window.deleteMany();
    await prisma.survey.deleteMany();
    await prisma.user.deleteMany();

    const survey = await prisma.survey.create({
    data: {
      name: "Candy survey",
    },
  });

  const window1 = await prisma.window.create({
    data: {
      background: "blue",
      buttons: {
        create: [
          { x: 10, y: 10, width: 100, height: 50, text: "Yes" },
          { x: 120, y: 10, width: 100, height: 50, text: "No" },
        ],
      },
      Text: {
        create: {
          x: 20,
          y: 80,
          width: 200,
          height: 50,
        },
      },
    },
  });

  const question1 = await prisma.question.create({
    data: {
      question: "Was the candy tasty?",
      sequence: 1,
      survey: {
        connect: { id: survey.id },
      },
      window: {
        connect: { id: window1.id },
      },
      answers: {
        create: [
          { answer: "Yes" },
          { answer: "No" },
          { answer: "Not sure" },
          { answer: "Yes" },
        ],
      },
    },
  });
}
(async () => {
        try {
            await main();
            await prisma.$disconnect();
        } catch (error) {
            console.error(error);
            await prisma.$disconnect();
            process.exit(1);
        }
})();