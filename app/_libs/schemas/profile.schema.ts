import { z } from "zod";

export const profileSchema = z.object({

  name: z.string()
    .min(1, "名前は必須です"),

  username: z.string()
    .min(4, "4文字以上で入力してください")
    .max(20, "ユーザー名は20文字以内で入力してください"),

})

// 型を自動生成
export type ProfileForm = z.infer<typeof profileSchema>;
