import { prisma } from "@/app/_libs/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server'


//都道府県のレスポンスの型
export type GetPrefectureResponse = {
  id: number
  name: string
}[]

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
