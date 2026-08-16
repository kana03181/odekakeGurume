import { PrismaClient } from "@/app/generated/prisma/client";

export const seedCategories = async ( prisma: PrismaClient ) => {
  await prisma.category.createMany({
    data: [
      { label: "利用シーン" },
      { label: "お食事" },
      { label: "設備" },
      { label: "その他" },
    ],
    skipDuplicates: true,
  })
}
