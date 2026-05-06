import { z } from "zod";

export const changeEmailSchema =  z.object({
  currentEmail: z.string()
    .trim()
    .email("無効なメールアドレス形式です"),

  newEmail: z.string()
    .trim()
    .min(1, "新しいメールアドレスを入力してください")
    .email("無効なメールアドレス形式です"),

})

// 型を自動生成
export type changeEmailForm = z.infer<typeof changeEmailSchema>;
