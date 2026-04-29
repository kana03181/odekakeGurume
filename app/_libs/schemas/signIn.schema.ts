import { z } from "zod";

export const signInSchema = z.object({
  email: z.string()
    .email("無効なメールアドレス形式です"),

  password: z.string()
    .min(6, "半角英数字6文字以上で入力してください")
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            "パスワードは英字と数字を含む必要があります"),
})

// 型を自動生成
export type SignInForm = z.infer<typeof signInSchema>;
