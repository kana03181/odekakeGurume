// //新規userDBの作成

import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/_libs/supabase";

//   //sign_upのフロントがAPIに送るデータの型
//   export type CreateUserRequestBody = {
//     supabaseUserId: string
//   }

// export const POST = async (request: NextRequest) => {
//   console.log("API開始");

//   const token = request.headers.get("Authorization") ?? '';
//   console.log("token", token);


//   const accessToken = token.replace("Bearer ", "");


//   // const { error } = await supabase.auth.getUser(token)

//   // if ( error )
//   //   return NextResponse.json({ status: error.message }, { status: 400 });

//   try {
//     const { data: { user }, error } = await supabase.auth.getUser(accessToken);

//     console.log("user:", user);
//     console.log("error:", error);

//     if ( error ) {
//       return NextResponse.json({ message: 'エラーがあるよ' })
//     }

//     if ( !user  ) {
//       return NextResponse.json({ message: 'ユーザー情報がないよ' })
//     }

//     const existingUser = await prisma.user.findUnique({
//       where: {
//         supabaseUserId: user.id,
//       }
//     })

//     if(existingUser) {
//       return NextResponse.json(existingUser)
//     }
//     console.log(existingUser);


//     // const body = await request.json()
//     // const { supabaseUserId } = body

//     const dbUser = await prisma.user.create({
//       data: {
//         supabaseUserId: user.id,
//         // userName: username
//       }
//     })

//     return NextResponse.json({ dbUser }, { status: 200 })

//   } catch ( error ) {
//     if ( error instanceof Error )
//       return NextResponse.json({ message : error.message }, { status:400 })
//   }

//   return NextResponse.json({ message : '予期しないエラー' }, { status:500 })
// }

export const POST = async (request: NextRequest) => {
  console.log("🚀 STEP 0: API開始");

  try {
    console.log("🚀 STEP 1: headers取得");
    const token = request.headers.get("authorization") ?? "";
    console.log("token:", token);

    const accessToken = token.replace("Bearer ", "");
    console.log("accessToken:", accessToken);

    console.log("🚀 STEP 2: Supabase認証開始");

    const { data, error: supabaseError } = await supabase.auth.getUser(accessToken);

    console.log("supabase result:", data);
    console.log("supabase error:", supabaseError);

    const user = data?.user;

    if (!user) {
      console.log("❌ STEP 2-FAIL: userなし");
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    console.log("🚀 STEP 3: Prisma検索");

    const existingUser = await prisma.user.findUnique({
      where: { supabaseUserId: user.id },
    });

    console.log("existingUser:", existingUser);

    if (existingUser) {
      console.log("🚀 STEP 3-RETURN: 既存ユーザー");
      return NextResponse.json(existingUser);
    }

    console.log("🚀 STEP 4: Prisma create");

    const dbUser = await prisma.user.create({
      data: {
        supabaseUserId: user.id,
        userName: null,
        name: null,
        thumbnailUrl: null,
        yearOfBirth: null,
      },
    });

    console.log("🚀 STEP 5: 作成成功");

    return NextResponse.json({ dbUser }, { status: 200 });
  } catch (error) {
    console.log("❌ GLOBAL ERROR:", error);

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "unknown",
        error,
      },
      { status: 400 }
    );
  }
};
