import { AgeGroup } from "@/app/generated/prisma/client";

export const AGE_GROUP_LABEL: Record<AgeGroup, string> = {
  [AgeGroup.ZERO_TO_TWO]: "0-2歳",
  [AgeGroup.THREE_TO_FIVE]: "3-5歳",
  [AgeGroup.OVER_SIX]: "6歳～",
}

export const AGE_GROUP_OPTIONS = Object.values(AgeGroup).map((value) => ({
  value,
  label: AGE_GROUP_LABEL[value]
}))
