import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Rating } from "@/app/generated/prisma/client"
// import { AgeGroup } from "@/app/generated/prisma/client"
import type { AgeGroup } from "@/app/_constants/ageGroupOptions";
import { getAuthUser } from "@/app/_libs/getAuthUser";


// 投稿作成時に送られてくるリクエストのbodyの型
export type CreatePostRequestBody = {
  shopId: number;
  visitedDate: Date;

  postImages: {
    imageUrl: string;
  }[];

  postFeatures: {
    featureId: number;
  }[];

  postChildren: {
    ageGroup: AgeGroup;
  }[];

  rating: number;
  comment: string;
  childFriendlyVote: boolean;
}


// const AgeGroupMap: Record<number, AgeGroup> = {
//   1: AgeGroup.ZERO_TO_TWO,
//   2: AgeGroup.THREE_TO_FIVE,
//   3: AgeGroup.OVER_SIX,
// }

const ratingMap: Record<number, Rating> = {
  1: Rating.ONE,
  2: Rating.TWO,
  3: Rating.THREE,
}


//APIが返すレスポンスの型
export type CreatePostResponse = {
  id: number
}

export const POST = async (request: NextRequest) => {
  //tokenの確認
    const { user, error } = await getAuthUser(request);

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

    const prismaRating = ratingMap[rating];

    if (!prismaRating) {
      throw new Error("不正な評価です");
    }

    console.log(postChildren);



    // 投稿をDBに生成
    const newPost =  await prisma.post.create({
      data: {
        userId: dbUser.id,
        shopId,
        visitedDate: new Date(visitedDate),
        rating:prismaRating,
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
            ageGroup: child.ageGroup as AgeGroup
          }))
        },
      },

      include: {
        postImages: true,
        postFeatures: true,
        postChildren: true,
      }
    })

    return NextResponse.json<CreatePostResponse>( { id: newPost.id}, { status: 200 } )

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json( { message: error.message }, { status: 400 } )
    }

    return NextResponse.json( { message: "予期しないエラーが発生しました" }, { status: 500 } )
  }
}
