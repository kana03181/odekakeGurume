import { prisma } from "@/app/_libs/prisma";

// 都道府県
const prefectures = [
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県"
] as const;

async function main() {
  // 都道府県
  await prisma.prefecture.createMany({
    data: prefectures.map((name, index) => ({
      id: index + 1,
      name,
    })),
    skipDuplicates: true,
  });

  // カテゴリー
  await prisma.category.createMany({
    data: [
      { label: "利用シーン" },
      { label: "年齢層" },
    ],
    skipDuplicates: true,
  })

  const usageSceneCategory = await prisma.category.findUnique({
    where: {
      label: "利用シーン",
    }
  })

  const ageGroupCategory = await prisma.category.findUnique({
    where: {
      label: "年齢層",
    }
  })

  // 利用シーン
  await prisma.feature.createMany({
    data: [
      {
        name: "朝ごはん",
        categoryId: usageSceneCategory!.id,
      },
      {
        name: "昼ごはん",
        categoryId: usageSceneCategory!.id,
      },
      {
        name: "夜ごはん",
        categoryId: usageSceneCategory!.id,
      },
      {
        name: "カフェ・休憩",
        categoryId: usageSceneCategory!.id,
      },
    ],
    skipDuplicates: true,
  })

  // 年齢層
  await prisma.feature.createMany({
    data: [
      {
        name: "0-2歳",
        categoryId: ageGroupCategory!.id,
      },
      {
        name: "3-5歳",
        categoryId: ageGroupCategory!.id,
      },
      {
        name: "6歳～",
        categoryId: ageGroupCategory!.id,
      }
    ],
    skipDuplicates: true,
  })

}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
