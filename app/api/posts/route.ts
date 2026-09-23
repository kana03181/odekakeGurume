import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Rating } from "@/app/generated/prisma/client"
import { getAuthUser } from "@/app/_libs/getAuthUser";
import { type CreatePostResponse } from "@/app/_types/posts";
import { createPostRequestSchema } from "@/app/_libs/schemas/createPostRequestSchema";


const ratingMap: Record<number, Rating> = {
  1: Rating.ONE,
  2: Rating.TWO,
  3: Rating.THREE,
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

    // リクエストのbodyを取得 + バリデーション
    const body = createPostRequestSchema.parse(
      await request.json()
    )

    const { shopId, visitedDate, postImages, postFeatures, postChildren, rating, comment, childFriendlyVote } = body;

    const prismaRating = ratingMap[rating];

    if (!prismaRating) {
      throw new Error("不正な評価です");
    }

    //口コミ投稿完了後にconsole.logで入力した情報を表示
    console.log("入力データ：", body);



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
            ageGroup: child.ageGroup
          }))
        },
      },

      //console.logで確認するために追加（後ほど削除）
      include:{
        postImages: true,
        postFeatures: true,
        postChildren: true,
      },

    })

    //DBに保存された投稿
    console.log("保存された投稿:", newPost);


    return NextResponse.json<CreatePostResponse>( { id: newPost.id}, { status: 200 } )

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json( { message: error.message }, { status: 400 } )
    }

    return NextResponse.json( { message: "予期しないエラーが発生しました" }, { status: 500 } )
  }
}
