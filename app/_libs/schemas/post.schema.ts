import { z } from "zod";

export const postSchema = z.object({

  shopName: z.string()
    .min(1, "名前は必須です"),

  comment: z.string()
    .min(4, "4文字以上で入力してください")
    .max(20, "ユーザー名は20文字以内で入力してください"),

  postImageUrl: z.string().optional(),


})

// 型を自動生成
export type PostForm = z.input<typeof postSchema>;
// export type ProfileFormOutput = z.output<typeof profileSchema>;
