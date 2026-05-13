import { prisma } from "@/app/_libs/prisma";
// import { createClient } from '@/app/_libs/supabase/server'
import { supabase } from "@/app/_libs/supabase";
import { NextResponse } from "next/server";
import { Rating } from "@/app/generated/prisma/client"
import { AgeGroup } from "@/app/generated/prisma/client"


// 投稿作成時に送られてくるリクエストのbodyの型
export type CreatePostRequestBody = {
  shopId: number
  visitedDate: Date

  postImages: {
    imageUrl: string
  }[]

  postFeatures: {
    featureId: number
  }[]

  postChildren: {
    ageGroup: AgeGroup
  }[]

  rating: Rating
  comment: string
  childFriendlyVote: boolean
}

// 投稿作成APIのレスポンスの型
export type CreatePostResponse = {
  id: number
}

export const POST = async (request: Request) => {

  // GET関数の引数からrequestを受け取り、その中のAuthorizationヘッダーを取り出す
  const authHeader = request.headers.get('Authorization') ?? ''
  const token = authHeader.replace('Bearer ', '')
  // console.log(token);


  const { error } = await supabase.auth.getUser(token)

  console.log(error);

  if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
  }


  try {
    // リクエストのbodyを取得
    const body: CreatePostRequestBody = await request.json()

    const { shopId, visitedDate, postImages, postFeatures, postChildren, rating, comment, childFriendlyVote } = body

    // ログインユーザー取得
    // const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser(token);
    // console.log(user);

    if (!user) {
      return NextResponse.json(
        { message: "ログインが必要です" },
        { status: 401 }
      )
    }

    const users = await prisma.user.findMany()
    console.log(users);


    // DBのユーザーを取得
    const dbUser = await prisma.user.findUnique({
      where: {
        supabaseUserId: user.id
      }
    })
    // console.log(dbUser);


    if (!dbUser) {
      return NextResponse.json(
        { message: "ユーザーが存在しません" },
        { status: 404 }
      )
    }

    // 投稿をDBに生成
    const data = await prisma.post.create({
      data: {
        userId: dbUser.id,
        shopId,
        visitedDate,
        rating,
        comment,
        childFriendlyVote,

        postImages: {
          create: postImages.map((image) => ({
            imageUrl: image.imageUrl
          }))
        },

        PostFeature: {
          create: postFeatures.map((feature) => ({
            featureId: feature.featureId
          }))
        },

        postChildren: {
          create: postChildren.map((child) => ({
            ageGroup: child.ageGroup
          }))
        },

      }
    })

    return NextResponse.json<CreatePostResponse>(
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
