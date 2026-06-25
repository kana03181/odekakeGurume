import { prisma } from "@/app/_libs/prisma";
import { supabaseAdmin } from "@/app/_libs/supabaseAdmin";
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server'
import { getAuthUser } from "@/app/_libs/getAuthUser";

export const DELETE = async (request:NextRequest) => {
  const { user, error } = await getAuthUser(request);

  if ( error ){
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  if ( !user ) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  try {

    //認証済みユーザーのDBレコード取得
    const existingUser = await prisma.user.findUnique({
      where: {
        supabaseUserId: user.id,
      },
    })

    if (!existingUser) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    //子ども情報削除 + アカウント論理削除
    await prisma.$transaction([
      prisma.child.deleteMany({
        where: {
          userId: existingUser.id,
        },
      }),

      prisma.user.update({
        where: {
          id: existingUser.id,
        },

        data: {
          deletedAt: new Date(),

          supabaseUserId: null,
          name: null,
          userName: null,
          gender: null,
          thumbnailUrl: null,
          yearOfBirth: null,
        }
      })
    ])
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (authError) {
      // DBは消えたがAuthの削除に失敗した場合のハンドリング
      console.error("Supabase Authの削除に失敗:", authError);
      return NextResponse.json({ message: "Auth deletion failed" }, { status: 500 })

    }

    return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 })


  } catch (error) {
    if ( error instanceof Error ) {
      return NextResponse.json( { message: error.message }, { status: 400 })
    }

    return NextResponse.json( { message: "予期しないエラーが発生しました" }, { status: 500 } )
  }

}
