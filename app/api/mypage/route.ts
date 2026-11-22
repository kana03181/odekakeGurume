import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/app/_libs/getAuthUser";
import { type MyPagePostsResponse } from "@/app/_types/mypage";



// GET: 口コミ一覧取得
export const GET = async (request: NextRequest) => {
  //tokenの確認
  const { user, error } = await getAuthUser(request);

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 401 }
    );
  }

  if(!user){
    return NextResponse.json(
      { message: "ログインが必要です" },
      { status: 401 }
    );
  }

  try {
    // DBのユーザー情報を取得
    const dbUser = await prisma.user.findUnique({
      where:{
        supabaseUserId: user.id,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { message: "ユーザーが存在しません" },
        { status: 404 }
      );
    }


    // DBから口コミ一覧と総件数を取得
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: {
          userId: dbUser.id,
        },

        select: {
          id: true,
          visitedDate: true,
          rating: true,
          childFriendlyVote: true,
          comment: true,
          createdAt: true,

          shop: {
            select: {
              id: true,
              prefectureId: true,
              name: true,
              address: true,
            },
          },

          user: {
            select: {
              userName: true,
              thumbnailUrl: true,
            },
          },

          postChildren: {
            select: {
              ageGroup: true,
            }
          },

          postImages: {
            select: {
              imageUrl: true,
            },
          },

        },

        // 作成日時の降順で取得
        orderBy: {
          createdAt: "desc",
        },
      }),

      //口コミの総件数
      prisma.post.count({
        where: {
          userId: dbUser.id,
        }
      }),
    ]);

    return NextResponse.json<MyPagePostsResponse>(
      {
        posts,
        totalCount,

       },
      { status: 200 }
    )

  } catch (error) {
    console.error("マイページ口コミ一覧取得エラー:", error);

    return NextResponse.json(
      { message: "マイページ内の口コミ一覧の取得に失敗しました" },
      { status: 500 }
    )

  }
}
