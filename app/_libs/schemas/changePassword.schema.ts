import { z } from "zod";

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "半角英数字6文字以上で入力してください")
              .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                "パスワードは英字と数字を含む必要があります"),

  newPassword: z.string().min(6, "半角英数字6文字以上で入力してください")
              .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                "パスワードは英字と数字を含む必要があります"),

  newPasswordConfirm: z.string().min(6, "半角英数字6文字以上で入力してください")
                    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                            "パスワードは英字と数字を含む必要があります"),
}).superRefine(({ newPassword, newPasswordConfirm }, ctx) => {
  if (newPassword !== newPasswordConfirm) {
    ctx.addIssue({
      path: ["newPasswordConfirm"],
      code: "custom",
      message: "新しいパスワードと確認用パスワードが一致しません",
    });
  }
});

// 型を自動生成
export type changePasswordForm = z.infer<typeof changePasswordSchema>;
