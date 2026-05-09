'use client'

import { supabase } from '@/app/_libs/supabase'
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
import { accountDeleteSchema, type accountDeleteForm } from "@/app/_libs/schemas/accountDelete.schema";
import { useSupabaseSession } from "@/app/_hook/useSupabaseSettion";
import { Button } from "@/app/_components/Button";
import { LinkButton } from "@/app/_components/LinkButton";
import { CheckboxInput } from "@/app/_components/CheckboxInput";
import Label from "@/app/_components/Label";
import TextArea from "@/app/_components/TextArea";

export default function Page() {
  // const router = useRouter()
  const { session, isLoading } = useSupabaseSession();

    const {
      register,
      handleSubmit,
      watch,
      formState: {
        errors,
        isSubmitting,
        isValid,
      }
    } = useForm<accountDeleteForm>({
      mode: "onChange",
      defaultValues: {
        reasons: [],
        agree: false,
      },
      resolver: zodResolver(accountDeleteSchema),
    });

  const reasonOptions = [
    {
      id: "hard-to-use",
      label: "使いにくい",
    },
    {
      id: "low-usage",
      label: "利用頻度が低い",
    },
    {
      id: "other",
      label: "その他",
    },
  ]

    const isAgreed = watch("agree");
    const isEnabled = isValid && isAgreed;



    const accountDeleteSubmit = async (data: accountDeleteForm) => {

      const { reasons } = data;
      console.log(reasons);

  }

  return (
    <div className='flex justify-center pt-60 pb-30'>
      {!isLoading && (
        <div>
          {session && (
            <form onSubmit={handleSubmit(accountDeleteSubmit)} className='space-y-4 w-full max-w-100'>
              <div className='mb-8 text-center space-y-4'>
                <p className='text-xl font-medium'>本当に削除しますか？</p>
                <p className='text-primary text-sm font-medium'>アカウントを削除すると、これまでの投稿、お気に入り、閲覧履歴がすべて消去され、復元することはできません。</p>
              </div>
              <div className='space-y-6'>
                <h2>退会の理由をお聞かせください</h2>
                <div className='space-y-3'>
                  {reasonOptions.map((reason) => (
                    <div className='flex gap-4 items-center justify-start' key={reason.id}>
                        <Label htmlFor={reason.id}>{reason.label}</Label>
                        <CheckboxInput
                          id={reason.id}
                          value={reason.id}
                          {...register("reasons")}
                          className='order-first rounded-full checkbox-border-primary border border-solid input-bg-secondary w-5 h-5'
                        />
                    </div>
                  ))}
                </div>
                <div>
                  <TextArea
                    {...register("message")}
                    placeholder='期待していた内容・欲しかった機能など'
                    className='textarea-bg-primary placeholder-[#544437] opacity-50'
                  />
                </div>
              </div>
              <div className='flex gap-4 items-center justify-start'>
                <CheckboxInput
                  {...register("agree")}
                  id='agree'
                  className='order-first rounded-full checkbox-border-primary border border-solid input-bg-secondary w-6 h-6'
                />
                <Label
                  htmlFor="agree"
                  className='block text-sm font-medium text-privacyPolicy'
                >
                    注意事項を理解した上で、アカウントを削除します
                </Label>
              </div>
              <div className='grid gap-4'>
                <Button type="submit" disabled={!isEnabled || isSubmitting} variant={isEnabled ? "primary" : "disabled" }>
                  アカウントを削除
                </Button>
                <LinkButton href="/mypage/setting/account" variant='outline'>キャンセル</LinkButton>
              </div>
            </form>
            )}
        </div>
      )}
    </div>
  );

}
