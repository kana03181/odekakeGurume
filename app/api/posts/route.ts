import { prisma } from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server'
import { Rating } from "@/app/generated/prisma/client"
import { AgeGroup } from "@/app/generated/prisma/client"
import { useAuthUser } from "@/app/_hooks/useAuthUser";


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

export const POST = async (request: NextRequest) => {
  //tokenの確認
    const { user, error } = await useAuthUser(request);

  // const authHeader = request.headers.get('Authorization') ?? ''
  // const accessToken = authHeader.replace('Bearer ', '')

  // console.log("authHeader:", authHeader);
  // console.log("accessToken:", accessToken);

  // const { data:{ user }, error } = await supabase.auth.getUser(accessToken);

  if ( error ){
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  if ( !user ) {
    return NextResponse.json( { message: "ログインが必要です" }, { status: 401 })
  }

  try {
    // DBのユーザー情報を取得
    const dbUser = await prisma.user.findUnique({
      where: {
        supabaseUserId: user.id
      }
    })

    // DBにユーザー情報がなかったらエラー
    if (!dbUser) {
      return NextResponse.json( { message: "ユーザーが存在しません" }, { status: 404 })
    }

    // リクエストのbodyを取得
    const body: CreatePostRequestBody = await request.json()
    const { shopId, visitedDate, postImages, postFeatures, postChildren, rating, comment, childFriendlyVote } = body


    // 投稿をDBに生成
    const newPost =  await prisma.post.create({
      data: {
        userId: dbUser.id,
        shopId,
        visitedDate: new Date(visitedDate),
        rating,
        comment,
        childFriendlyVote,

        postImages: {
          create: postImages.map((image) => ({
            imageUrl: image.imageUrl
          }))
        },

        postFeatures: {
          create: postFeatures.map((feature) => ({
            featureId: feature.featureId
          }))
        },

        postChildren: {
          create: postChildren.map((child) => ({
            ageGroup: child.ageGroup
          }))
        },
      },

      include: {
        postImages: true,
        postFeatures: true,
        postChildren: true,
      }
    })

    return NextResponse.json<CreatePostRequestBody>( newPost, { status: 200 }
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
