import { prisma } from '@/app/_libs/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "@/app/_libs/supabase";

// 投稿作成時に送られてくるGETリクエストの型
export type PostShowResponse = {
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
      userName: string | null;
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

    if(!post){
      return NextResponse.json(
      { message: "投稿が見つかりません。" },
      { status: 404 }
      )
    }

    let ProfileThumbnailUrl: string | null = null;

    if (post.user.thumbnailUrl) {
      const { data, error } = await supabase
        .storage
        .from("profile_thumbnail")
        .createSignedUrl( post.user.thumbnailUrl, 60 * 60)

      if (data) {
        ProfileThumbnailUrl = data.signedUrl;
      }
    }


    //レスポンスを返す
    return NextResponse.json<PostShowResponse>(
      { post},
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
