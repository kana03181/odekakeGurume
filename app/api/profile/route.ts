import { prisma } from "@/app/_libs/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server'
import { Child, Gender } from "@/app/generated/prisma/client"
import { supabase } from "@/app/_libs/supabase";
import { useAuthUser } from "@/app/_hooks/useAuthUser";


/* ======================
  supabaseUserIdの取得
======================= */

//プロフィールのレスポンスの型
export type GetProfileResponse = {
  supabaseUserId: string | null
  name: string | null
  userName: string | null
  thumbnailUrl: string | null
  gender: Gender | null
  yearOfBirth: number | null
  children: {
    birthYear: number
    birthMonth: number
  }[]
  createdAt: Date
  updatedAt: Date
}

export const GET = async (request: NextRequest) => {

  const { user, error } = await useAuthUser(request);

  if ( error ){
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  // const user = data.user;

  if ( !user ) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  try {
    const profile = await prisma.user.findUnique({
      where: {
        supabaseUserId: user.id,
      },

      include: {
        children: {
          select: {
            birthYear: true,
            birthMonth: true,
          }
        },
      },

    })

    // console.log(profile);

    if (!profile) {
      return NextResponse.json( { message: "undefined profile" }, { status: 404 } )
    }

    return NextResponse.json<GetProfileResponse>( profile, { status: 200 } )

  } catch (error) {
    if ( error instanceof Error ) {
      return NextResponse.json( { message: error.message }, { status: 400 })
    }
  }
}


/* ======================
  ↓ プロフィールを更新 ↓
======================= */

//プロフィール更新時に送られてくるリクエストのbodyの型
export type UpdateProfileRequestBody = {
  name: string | null
  userName: string | null
  thumbnailUrl: string | null
  gender: Gender | null
  yearOfBirth: number | null
  children?: {
    birthYear: number
    birthMonth: number
  }[]
}

export const PUT = async (request: NextRequest) => {

  //tokenの確認
  // const token = request.headers.get("authorization") ?? '';
  // const accessToken = token.replace("Bearer ", "");

    const { user, error } = await useAuthUser(request);


  // const { data:{ user }, error } = await supabase.auth.getUser(accessToken);

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
    const updateProfile = await prisma.user.update({
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

    return NextResponse.json<UpdateProfileRequestBody>( updateProfile , { status: 200 } )

  } catch (error) {
    if ( error instanceof Error ) {
      return NextResponse.json( { message: error.message }, { status: 400 })
    }

    return NextResponse.json( { message: "予期しないエラーが発生しました" }, { status: 500 } )
  }
}
