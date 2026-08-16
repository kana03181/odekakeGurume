import { NextResponse } from "next/server";
import { AgeGroup } from "@/app/generated/prisma/client";
import { AGE_GROUP_LABEL } from "@/app/_constants/ageGroupOptions";

export async function GET() {
  const options = Object.values(AgeGroup).map((value) => ({
    value,
    label: AGE_GROUP_LABEL[value],
  }));

  return NextResponse.json(options);
}
