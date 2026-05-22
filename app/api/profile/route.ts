import { prisma } from "@/app/_libs/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server'
import { Gender } from "@/app/generated/prisma/client"
import { supabase } from "@/app/_libs/supabase";


/* ======================
  supabaseUserIdの取得
======================= */

export const GET = async (request: NextRequest) => {

  const token = request.headers.get("authorization") ?? '';
  const accessToken = token.replace("Bearer ", "");
  // console.log(accessToken);

  //誰のtokenかを確認
  const { data:{ user }, error } = await supabase.auth.getUser(accessToken);

  if ( error ){
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  // const user = data.user;

  if ( !user ) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  try {
    const username = await prisma.user.findUnique({
      where: {
        supabaseUserId: user.id,
      },

    })

    console.log(username);

    if (!username) {
      return NextResponse.json( { message: "undefined username" }, { status: 404 } )
    }

    return NextResponse.json( username, { status: 200 } )

  } catch (error) {
    if ( error instanceof Error ) {
      return NextResponse.json( { message: error.message }, { status: 400 })
    }
  }
}




/* ======================
  ↓ プロフィールを更新 ↓
======================= */

//プロフィール作成時に送られてくるリクエストのbodyの型
export type UpdateProfileRequestBody = {
  name: string
  userName: string
  thumbnailUrl?: string
  gender?: Gender
  yearOfBirth: number
  children?: {
    birthYear: number
    birthMonth: number
  }[]
}

export const PUT = async (request: Request) => {

  //tokenの確認
  const token = request.headers.get("authorization") ?? '';
  const accessToken = token.replace("Bearer ", "");
  // console.log(accessToken);

  const { data:{ user }, error } = await supabase.auth.getUser(accessToken);

  if ( error ){
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  if ( !user ) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  try {

    //bodyの中から取り出す
    const { name, userName, thumbnailUrl, gender, yearOfBirth, children }: UpdateProfileRequestBody = await request.json()

    //プロフィールを更新
    await prisma.user.update({
      where: {
        supabaseUserId: user.id,
      },
      data: {
        name,
        userName,
        gender,
        thumbnailUrl,
        yearOfBirth,

        // childrenが送られてきた場合のみchildrenを更新
        // 既存childrenを一度削除して再生成する
        // childrenがundefinedの場合はchildrenを更新しない
        ...(children !== undefined && {
          children: {
            deleteMany: {},
            create: children.map((item) => ({
              birthYear: item.birthYear,
              birthMonth: item.birthMonth,
            })),
          }
        })
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
