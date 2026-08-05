import { PrismaClient } from "@prisma/client";

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl?.startsWith("postgresql") || databaseUrl?.startsWith("postgres")) {
    try {
      const { PrismaPg } = require("@prisma/adapter-pg");
      const adapter = new PrismaPg({ connectionString: databaseUrl });
      return new PrismaClient({ adapter });
    } catch {
      return new PrismaClient();
    }
  }

  try {
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
    return new PrismaClient({ adapter });
  } catch {
    return new PrismaClient();
  }
}

const prisma = createPrismaClient();

async function main() {
  const userId = "demo-user";

  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      name: "Usuário Demo",
      email: "demo@taskcalendar.com",
    },
  });

  console.log("User created:", user.name);

  const categories = [
    { name: "Trabalho", color: "#6366f1", icon: "briefcase" },
    { name: "Pessoal", color: "#ec4899", icon: "user" },
    { name: "Saúde", color: "#22c55e", icon: "heart" },
    { name: "Estudos", color: "#f59e0b", icon: "book-open" },
    { name: "Casa", color: "#8b5cf6", icon: "home" },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { userId_name: { userId, name: cat.name } },
      update: {},
      create: { ...cat, userId },
    });
    createdCategories.push(c);
  }

  console.log("Categories created:", createdCategories.length);

  const tags = [
    { name: "urgente", color: "#ef4444" },
    { name: "importante", color: "#f97316" },
    { name: "reunião", color: "#3b82f6" },
    { name: "projeto", color: "#8b5cf6" },
  ];

  const createdTags = [];
  for (const tag of tags) {
    const t = await prisma.tag.upsert({
      where: { userId_name: { userId, name: tag.name } },
      update: {},
      create: { ...tag, userId },
    });
    createdTags.push(t);
  }

  console.log("Tags created:", createdTags.length);

  const today = new Date();
  const tasks = [
    {
      title: "Reunião de planejamento semanal",
      description: "Definir metas e prioridades da semana",
      date: today,
      startTime: "09:00",
      endTime: "10:00",
      duration: 60,
      priority: "high" as const,
      status: "in_progress" as const,
      categoryId: createdCategories[0].id,
    },
    {
      title: "Revisar código do projeto",
      description: "Fazer code review das PRs pendentes",
      date: today,
      startTime: "14:00",
      endTime: "15:30",
      duration: 90,
      priority: "medium" as const,
      status: "not_started" as const,
      categoryId: createdCategories[0].id,
    },
    {
      title: "Exercício físico",
      description: "Treino de academia",
      date: today,
      startTime: "07:00",
      endTime: "08:00",
      duration: 60,
      priority: "medium" as const,
      status: "completed" as const,
      categoryId: createdCategories[2].id,
    },
    {
      title: "Estudar Next.js 15",
      description: "Novidades do App Router e Server Components",
      date: new Date(today.getTime() + 86400000),
      startTime: "10:00",
      endTime: "12:00",
      duration: 120,
      priority: "high" as const,
      status: "not_started" as const,
      categoryId: createdCategories[3].id,
    },
    {
      title: "Comprar mantimentos",
      description: "Lista de compras do mês",
      date: new Date(today.getTime() + 86400000),
      startTime: "18:00",
      endTime: "19:00",
      duration: 60,
      priority: "low" as const,
      status: "not_started" as const,
      categoryId: createdCategories[4].id,
    },
    {
      title: "Apresentação para cliente",
      description: "Preparar slides da proposta",
      date: new Date(today.getTime() + 2 * 86400000),
      startTime: "15:00",
      endTime: "16:00",
      duration: 60,
      priority: "urgent" as const,
      status: "not_started" as const,
      categoryId: createdCategories[0].id,
    },
    {
      title: "Limpar a casa",
      description: "Faxina geral",
      date: new Date(today.getTime() + 3 * 86400000),
      startTime: "09:00",
      endTime: "11:00",
      duration: 120,
      priority: "medium" as const,
      status: "not_started" as const,
      categoryId: createdCategories[4].id,
    },
    {
      title: "Ler livro",
      description: "Continuar leitura do capítulo 5",
      date: new Date(today.getTime() - 86400000),
      startTime: "21:00",
      endTime: "22:00",
      duration: 60,
      priority: "low" as const,
      status: "completed" as const,
      categoryId: createdCategories[1].id,
    },
  ];

  for (const taskData of tasks) {
    const task = await prisma.task.create({
      data: {
        ...taskData,
        userId,
        subtasks: taskData.title.includes("Reunião")
          ? {
              create: [
                { title: "Preparar pauta", order: 0 },
                { title: "Convidar participantes", order: 1 },
                { title: "Reservar sala", order: 2 },
              ],
            }
          : undefined,
        checklists: taskData.title.includes("Comprar")
          ? {
              create: [
                { title: "Arroz", checked: false, order: 0 },
                { title: "Feijão", checked: false, order: 1 },
                { title: "Óleo", checked: false, order: 2 },
                { title: "Leite", checked: false, order: 3 },
              ],
            }
          : undefined,
      },
    });

    await prisma.taskTag.create({
      data: {
        taskId: task.id,
        tagId: createdTags[taskData.priority === "urgent" ? 0 : taskData.priority === "high" ? 1 : 2].id,
      },
    });
  }

  console.log("Tasks created:", tasks.length);

  await prisma.goal.create({
    data: {
      title: "Completar 20 tarefas esta semana",
      type: "weekly",
      target: 20,
      current: 5,
      startDate: today,
      endDate: new Date(today.getTime() + 7 * 86400000),
      userId,
    },
  });

  await prisma.goal.create({
    data: {
      title: "50 tarefas este mês",
      type: "monthly",
      target: 50,
      current: 15,
      startDate: today,
      endDate: new Date(today.getTime() + 30 * 86400000),
      userId,
    },
  });

  console.log("Goals created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
