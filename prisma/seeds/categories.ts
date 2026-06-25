import { PrismaClient } from "@/app/generated/prisma/client";

export const seedCategories = async ( prisma: PrismaClient ) => {
  await prisma.category.createMany({
    data: [
      { label: "利用シーン" },
      { label: "年齢層" },
      { label: "お食事" },
      { label: "設備" },
      { label: "その他" },
    ],
    skipDuplicates: true,
  })
}
