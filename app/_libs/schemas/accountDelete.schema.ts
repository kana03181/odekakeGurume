import { z } from "zod";

export const accountDeleteSchema = z.object({
  reasons: z.array(
    z.object({
      reason: z.string(),
      })
  ),

  message: z.string()
    .max(500, "500文字以内で入力してください"),

  agree: z.boolean().refine((val) => val  === true, {
    message: "注意事項に同意する必要があります"
  }),


})

// 型を自動生成
export type accountDeleteForm = z.infer<typeof accountDeleteSchema>;
