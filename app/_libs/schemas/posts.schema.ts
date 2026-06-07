import { z } from "zod";

export const postsSchema = z.object({

  shopName: z.string()
    .min(1, "店名は必須です"),


  prefecture: z.string()
    .refine((value) => value != "--", {
      message: "都道府県を選択してください",
    }),

  visitedDate: z.coerce.date({
    message: "日付を選択してください",
  }),

  comment: z.string().optional(),
    // .min(4, "4文字以上で入力してください")
    // .max(20, "ユーザー名は20文字以内で入力してください"),

  postsImageUrl: z.string().optional(),

  usageScenes: z.array(z.string())
    .min(1, "利用シーンを選択してください"),

  children: z.array(
    z.object({
      ageGroup: z.enum(["0_2", "3_5", "6_plus"]),
      count: z.number().min(0),
    })
  )




})

// 型を自動生成
export type PostsForm = z.input<typeof postsSchema>;
// export type ProfileFormOutput = z.output<typeof profileSchema>;
