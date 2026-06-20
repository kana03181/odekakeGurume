import { PrismaClient } from "@/app/generated/prisma/client";

export const seedFeatures = async ( prisma: PrismaClient ) => {

  const categories = await prisma.category.findMany({
    where: {
      label: {
        in: ["利用シーン", "年齢層", "お食事", "設備", "その他"],
      },
    },
  });

  const categoryMap = Object.fromEntries(
    categories.map((category) => [
      category.label,
      category.id,
    ])
  )


  if (categoryMap["利用シーン"] === undefined || categoryMap["年齢層"] === undefined || categoryMap["お食事"] === undefined || categoryMap["設備"] === undefined || categoryMap["その他"] === undefined) {
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
      },

      // お食事
      {
        name: "キッズチェアあり",
        categoryId: categoryMap["お食事"],
      },
      {
        name: "キッズカトラリー",
        categoryId: categoryMap["お食事"],
      },
      {
        name: "キッズメニュー",
        categoryId: categoryMap["お食事"],
      },
      {
        name: "離乳食持ち込み可",
        categoryId: categoryMap["お食事"],
      },
      {
        name: "アレルギー相談可",
        categoryId: categoryMap["お食事"],
      },

      // 設備
      {
        name: "ベビーカーＯＫ",
        categoryId: categoryMap["設備"],
      },
      {
        name: "個室あり",
        categoryId: categoryMap["設備"],
      },
      {
        name: "エレベーターあり",
        categoryId: categoryMap["設備"],
      },
      {
        name: "授乳室あり",
        categoryId: categoryMap["設備"],
      },
      {
        name: "キッズスペースあり",
        categoryId: categoryMap["設備"],
      },
      {
        name: "駐車場あり",
        categoryId: categoryMap["設備"],
      },

      // その他
      {
        name: "貸し切りＯＫ",
        categoryId: categoryMap["その他"],
      },
      {
        name: "予約可",
        categoryId: categoryMap["その他"],
      },
    ],
    skipDuplicates: true,
  })

}
