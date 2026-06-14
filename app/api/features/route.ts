import { prisma } from "@/app/_libs/prisma";
import { NextResponse, NextRequest } from "next/server";

//都道府県のレスポンスの型
export type GetFeatureResponse = {
  id: number
  name: string
}[];

export const GET = async (request: NextRequest) => {
  try {
    const category = request.nextUrl.searchParams.get("category");

    if (!category) {
      return NextResponse.json({ message: "category is required" }, { status: 400 });
    }

    const features = await prisma.feature.findMany({
      where: {
        category:{ label: category },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        id: "asc",
      },
    })

    return NextResponse.json<GetFeatureResponse>(features, {status: 200})

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({message: error.message}, {status: 500})
    }

    return NextResponse.json({message: "予期しないエラー"}, {status: 500})
  }
}
