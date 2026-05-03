import { z } from "zod";

export const resetPasswordSchema = z.object({
  email: z.string()
    .email("無効なメールアドレス形式です"),
})

// 型を自動生成
export type resetPasswordForm = z.infer<typeof resetPasswordSchema>;
