//新規userDBの作成

import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/_libs/supabase";

  //sign_inのフロントがAPIに送るデータの型
  // export type CreateUserRequestBody = {
  //   supabaseUserId: string
  // }

export const POST = async (request: NextRequest) => {
  console.log("API開始");

  try {
    const token = request.headers.get("authorization") ?? '';
    console.log("token", token);

    const accessToken = token.replace("Bearer ", "");

    const { data, error } = await supabase.auth.getUser(accessToken);

    if ( error )
      return NextResponse.json({ message: error.message }, { status: 401 });

    // console.log("user:", data.user);

    const user = data.user;

    if (!user) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        supabaseUserId: user.id,
      },
    })
    // console.log(existingUser);

    if ( existingUser  ) {
      return NextResponse.json(existingUser)
    }

    const dbUser = await prisma.user.create({
      data: {
        supabaseUserId: user.id,
        userName: user.user_metadata.user_name,
        name: null,
        thumbnailUrl: null,
        gender: null,
        yearOfBirth: null,
      }
    })

    return NextResponse.json({ dbUser }, { status: 201 })

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

//デバック用
// export const POST = async (request: NextRequest) => {
//   console.log("🚀 STEP 0: API開始");

//   try {
//     console.log("🚀 STEP 1: headers取得");
//     const token = request.headers.get("authorization") ?? "";
//     console.log("token:", token);

//     const accessToken = token.replace("Bearer ", "");
//     console.log("accessToken:", accessToken);

//     console.log("🚀 STEP 2: Supabase認証開始");

//     const { data, error: supabaseError } = await supabase.auth.getUser(accessToken);

//     console.log("supabase result:", data);
//     console.log("supabase error:", supabaseError);

//     const user = data?.user;

//     if (!user) {
//       console.log("❌ STEP 2-FAIL: userなし");
//       return NextResponse.json({ message: "unauthorized" }, { status: 401 });
//     }

//     console.log("🚀 STEP 3: Prisma検索");

//     const existingUser = await prisma.user.findUnique({
//       where: { supabaseUserId: user.id },
//     });

//     console.log("existingUser:", existingUser);

//     if (existingUser) {
//       console.log("🚀 STEP 3-RETURN: 既存ユーザー");
//       return NextResponse.json(existingUser);
//     }

//     console.log("🚀 STEP 4: Prisma create");

//     const dbUser = await prisma.user.create({
//       data: {
//         supabaseUserId: user.id,
//         userName: null,
//         name: null,
//         thumbnailUrl: null,
//         gender: null,
//         yearOfBirth: null,
//       },
//     });

//     console.log("🚀 STEP 5: 作成成功");

//     return NextResponse.json({ dbUser }, { status: 200 });
//   } catch (error) {
//     console.log("❌ GLOBAL ERROR:", error);

//     return NextResponse.json(
//       {
//         message: error instanceof Error ? error.message : "unknown",
//         error,
//       },
//       { status: 400 }
//     );
//   }
// };
