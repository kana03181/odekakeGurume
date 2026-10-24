import { prisma } from "@/app/_libs/prisma";
import { NextResponse } from "next/server";
import { type GetPrefectureResponse } from "@/app/_types/prefecture";

export const GET = async () => {
  try {
    const prefectures = await prisma.prefecture.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json<GetPrefectureResponse>(prefectures, {status: 200})

  } catch (error) {
    if ( error instanceof Error ) {
      return NextResponse.json( { message: error.message }, { status: 400 })
    }

  }
}
