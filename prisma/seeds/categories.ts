import { PrismaClient } from "@/app/generated/prisma/client";

export const seedCategories = async ( prisma: PrismaClient ) => {
  await prisma.category.createMany({
    data: [
      { label: "利用シーン" },
      { label: "年齢層" },
    ],
    skipDuplicates: true,
  })
}
