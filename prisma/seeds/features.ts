import { PrismaClient } from "@/app/generated/prisma/client";

export const seedFeatures = async ( prisma: PrismaClient ) => {

  const categories = await prisma.category.findMany({
    where: {
      label: {
        in: ["利用シーン", "年齢層"],
      },
    },
  });

  const categoryMap = Object.fromEntries(
    categories.map((category) => [
      category.label,
      category.id,
    ])
  )


  if (categoryMap["利用シーン"] === undefined || categoryMap["年齢層"] === undefined ) {
    throw new Error("カテゴリーが存在しません");
  }

  // 利用シーン
  await prisma.feature.createMany({
    data: [
      {
        name: "朝ごはん",
        categoryId: categoryMap["利用シーン"],
      },
      {
        name: "昼ごはん",
        categoryId: categoryMap["利用シーン"],
      },
      {
        name: "夜ごはん",
        categoryId: categoryMap["利用シーン"],
      },
      {
        name: "カフェ・休憩",
        categoryId: categoryMap["利用シーン"],
      },

      // 年齢層
      {
        name: "0-2歳",
        categoryId: categoryMap["年齢層"],
      },
      {
        name: "3-5歳",
        categoryId: categoryMap["年齢層"],
      },
      {
        name: "6歳～",
        categoryId: categoryMap["年齢層"],
      }
    ],
    skipDuplicates: true,
  })

}
