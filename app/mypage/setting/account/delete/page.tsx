'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { changePasswordSchema, type changePasswordForm } from "@/app/_libs/schemas/changePassword.schema";
import { useSupabaseSession } from "@/app/_hook/useSupabaseSettion";
import { Button } from "@/app/_components/Button";
import { CheckboxInput } from "@/app/_components/checkboxInput";
import Label from "@/app/_components/Label";

export default function Page() {
  const router = useRouter()
  const {session, isLoading} = useSupabaseSession();

  return (
    <div>
      <div>
        <p>本当に削除しますか？</p>
        <p>アカウントを削除すると、これまでの投稿、お気に入り、閲覧履歴がすべて消去され、復元することはできません。</p>
      </div>

      <div>
        <h2>退会の理由をお聞かせください</h2>
        <CheckboxInput>
        // {...register("newEmail")}
        id='difficultToUse'
        value="difficultToUse"
        name="delete[]"
        className='input-bg-primary block w-full p-2.5'
          <Label htmlFor='difficultToUse'>
              使いにくい
          </Label>
        </CheckboxInput>
        <CheckboxInput>
        // {...register("newEmail")}
        id='UsageFrequency'
        value="UsageFrequency"
        name="delete[]"
        className='input-bg-primary block w-full p-2.5'
          <Label htmlFor='UsageFrequency'>
              利用頻度が低い
          </Label>
        </CheckboxInput>
        <CheckboxInput>
        // {...register("newEmail")}
        id='other'
        value="other"
        name="delete[]"
        className='input-bg-primary block w-full p-2.5'
          <Label htmlFor='other'>
              その他
          </Label>
        </CheckboxInput>
      </div>
      <div>
        <Button type="submit" disabled={isSubmitting}>アカウントを削除</Button>
        <Button type="submit" disabled={isSubmitting} variant = "outline">キャンセル</Button>
      </div>

    </div>
  );
}
