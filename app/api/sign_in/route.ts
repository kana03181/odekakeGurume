//新規userDBの作成

import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/_libs/supabase";

export const POST = async (request: NextRequest) => {

  try {
    const token = request.headers.get("authorization") ?? '';
    const accessToken = token.replace("Bearer ", "");

    //誰のtokenかを確認
    const { data, error } = await supabase.auth.getUser(accessToken);

    if ( error ){
      return NextResponse.json({ message: error.message }, { status: 401 });
    }

    const user = data.user;

    if (!user) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    //DBにユーザーが存在するかを確認
    const existingUser = await prisma.user.findUnique({
      where: {
        supabaseUserId: user.id,
      },
    })

    //DBにユーザーがいたら、新規作成しない
    if ( existingUser  ) {
      return NextResponse.json(existingUser)
    }

    await prisma.user.create({
      data: {
        supabaseUserId: user.id,
        userName: user.user_metadata.user_name,
      }
    })

    return NextResponse.json({ message: "user created" }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "unknown error",
      },
      { status:500 }
    )
  }
}
