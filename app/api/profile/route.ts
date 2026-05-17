import { prisma } from "@/app/_libs/prisma";
import { NextResponse } from "next/server";
import { Gender } from "@/app/generated/prisma/client"
import { supabase } from "@/app/_libs/supabase";

//プロフィール作成時に送られてくるリクエストのbodyの型
export type UpdateProfileRequestBody = {
  name: string
  thumbnailUrl?: string
  gender: Gender
  yearOfBirth: number
  children?: {
    birthYear: number
    birthMonth: number
  }[]
}

export const PATCH = async (request: Request) => {

  //tokenの確認
  const token = request.headers.get("authorization") ?? '';
  const accessToken = token.replace("Bearer ", "");
  // console.log(accessToken);

  const { data:{ user }, error } = await supabase.auth.getUser(accessToken);

  if ( error ){
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  if ( !user ) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  try {

    //bodyの中から取り出す
    const { name, thumbnailUrl, gender, yearOfBirth, children }: UpdateProfileRequestBody = await request.json()

    //プロフィールを更新
    await prisma.user.update({
      where: {
        supabaseUserId: user.id,
      },
      data: {
        name,
        gender,
        thumbnailUrl,
        yearOfBirth,

        children: {
          deleteMany:{},
          create: children?.map((item) => ({
            birthYear: item.birthYear,
            birthMonth: item.birthMonth,
          })) ?? [],
        },
      }
    })

    return NextResponse.json( { message: "profile updated" }, { status: 200 } )

  } catch (error) {
    if ( error instanceof Error ) {
      return NextResponse.json( { message: error.message }, { status: 400 })
    }

    return NextResponse.json( { message: "予期しないエラーが発生しました" }, { status: 500 } )
  }
}
