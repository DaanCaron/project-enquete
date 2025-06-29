import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      background: "#6765f0",
      buttons: {
        create: [
          { x: 700, y: 500, width: 200, height: 100, text: "Yes" },
          { x: 1000, y: 500, width: 200, height: 100, text: "No" },
        ],
      },
      text: {
        create: {
          x: 960,
          y: 200,
          width: 400,
          height: 100,
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

  const window2 = await prisma.window.create({
    data: {
      background: "#07f5f0",
      buttons: {
        create: [
          { x: 650, y: 500, width: 200, height: 100, text: "Yes" },
          { x: 1100, y: 500, width: 200, height: 100, text: "No" },
          { x: 1100, y: 500, width: 200, height: 100, text: "Non opinion" },
        ],
      },
      text: {
        create: {
          x: 460,
          y: 200,
          width: 400,
          height: 100,
        },
      },
    },
  });

  const question2 = await prisma.question.create({
    data: {
      question: "Was it a candy tasty?",
      sequence: 2,
      survey: {
        connect: { id: survey.id },
      },
      window: {
        connect: { id: window2.id },
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
};
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
