import { prisma } from "@/app/_libs/prisma";
import { seedPrefectures } from "./prefectures";
import { seedCategories } from "./categories";
import { seedFeatures } from "./features";


async function main(){
  await seedPrefectures(prisma);
  await seedCategories(prisma);
  await seedFeatures(prisma);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
