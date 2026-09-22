import { prisma } from '@/app/_libs/prisma';
import { NextRequest, NextResponse } from 'next/server';


// 投稿作成時に送られてくるGETリクエストの型
export type postShowResponse = {
  post: {
    id: number,
    shop: {
      id: number;
      prefectureId: number;
      name: string;
      address: string;
    }
    visitedDate: Date;
    rating: string;
    childFriendlyVote: boolean;
    comment: string;
    createdAt: Date;

    user: {
      userName: string;
      thumbnailUrl: string | null;
    };

    postChildren: {
      ageGroup: string;
    }[];

    postImages: {
      imageUrl: string;
    }[];

    postFeatures: {
      featureId: number;
      feature: {
        name: string;
        categoryId: number;
        category: {
          label: string
        }
      }
    }[];
  }
}

export const GET = async(
  _request: NextRequest,
  { params }: { params: Promise<{id: string}>},
) => {
  const { id } = await params

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },

      include: {
        user: true,
        shop: true,
        postImages: true,
        postFeatures: {
          include: {
            feature:{
              include: {
                category: true,
              }
            },
          },
        },
        postChildren: true,
      },
    })

    console.log("詳細の情報：", post);

    if (!post) {
      return NextResponse.json(
        { message: "投稿が見つかりません。" },
        { status: 404 }
      )
    }

    //レスポンスを返す
    return NextResponse.json(
      { post },
      { status: 200 }
    )

  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
  }


}
