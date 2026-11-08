import { z } from "zod";

export const postsSchema = z.object({

  shopName: z.string()
    .min(1, "店名は必須です"),


  prefecture: z.string()
    .refine((value) => value != "--", {
      message: "都道府県を選択してください",
    }),

  visitedDate: z.string({
    message: "日付を選択してください",
  }),

  postsImageUrl: z.array(z.string()).max(3),

  usageScenes: z.string()
    .min(1, "利用シーンを選択してください"),

  children: z.array(
    z.object({
      ageGroup: z.string().min(1, "年齢を選択してください"),
      count: z.number().min(0),
    })
  ),

  rating: z.number()
    .min(1, "オススメ度を選択してください")
    .max(3),

  comment: z.string()
    .max(500, "コメントは500文字以内で入力してください"),

  meals: z.array(z.string()).optional(),

  facilities: z.array(z.string()).optional(),

  others: z.array(z.string()).optional(),

  childFriendlyVote: z.enum(["true", "false"], {
    error: "どちらかを選択してください。"
  }),

});

// 型を自動生成
export type PostsForm = z.infer<typeof postsSchema>;
