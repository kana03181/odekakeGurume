import { z } from "zod";

export const userSchema = z.object({
  email: z.string()
    .email("無効なメールアドレス形式です"),

  password: z.string()
    .min(6, "半角英数字6文字以上で入力してください")
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            "パスワードは英字と数字を含む必要があります"),

  username: z.string()
    .min(4, "4文字以上で入力してください")
    .max(20, "ユーザー名は20文字以内で入力してください"),

  agree: z.boolean().refine((val) => val  === true, {
    message: "利用規約とプライバシーポリシーに同意する必要があります"
  }),
})

// 型を自動生成
export type UserForm = z.infer<typeof userSchema>;
