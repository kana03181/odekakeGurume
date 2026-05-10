import { prisma } from "@/app/_libs/prisma";
import { NextResponse } from "next/server";
import { Gender } from "@/app/generated/prisma/client"

//プロフィール作成時に送られてくるリクエストのbodyの型
export type CreateProfileRequestBody = {
  supabaseUserId: string
  name: string
  userName: string
  thumbnailUrl?: string
  gender: Gender
  yearOfBirth: number
  children: {
    birthYear: number
    birthMonth: number
  }[]
}

//プロフィール作成APIのレスポンスの型
export type CreateProfileResponse = {
  id: number
}

export const POST = async (request: Request) => {
  try {
    //リクエストbodyを取得
    const body: CreateProfileRequestBody = await request.json()

    //bodyの中から取り出す
    const { supabaseUserId, name, userName, thumbnailUrl, gender, yearOfBirth, children } = body

    //プロフィールをDBに生成
    const data = await prisma.user.create({
      data: {
        supabaseUserId,
        name,
        userName,
        gender,
        thumbnailUrl,
        yearOfBirth,

        children: {
          create: children.map((item) => ({
            birthYear: item.birthYear,
            birthMonth: item.birthMonth,
          }))
        },
      }
    })

    return NextResponse.json<CreateProfileResponse>(
      { id: data.id, },
      { status: 201 }
    )

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "予期しないエラーが発生しました" },
      { status: 500 }
    )
  }
}
