import { z } from "zod";

export const profileSchema = z.object({

  name: z.string()
    .min(1, "名前は必須です"),

  username: z.string()
    .min(4, "4文字以上で入力してください")
    .max(20, "ユーザー名は20文字以内で入力してください"),

  thumbnailUrl: z.string().optional(),

  thumbnailImageKey: z.string().optional(),

  gender: z.enum(["MALE", "FEMALE", "NOT_TO_SAY"]).optional(),

  yearOfBirth: z.coerce
  .number().min(1960).max(2011),

  children: z.array(
    z.object({
      birthYear: z.coerce.number(),
      birthMonth: z.coerce.number(),
    })
  ).optional(),

})

// 型を自動生成
export type ProfileForm = z.input<typeof profileSchema>;
// export type ProfileFormOutput = z.output<typeof profileSchema>;
