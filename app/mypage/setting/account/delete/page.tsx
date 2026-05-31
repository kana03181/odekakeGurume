'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { accountDeleteSchema, type accountDeleteForm } from "@/app/_libs/schemas/accountDelete.schema";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { Button } from "@/app/_components/Button";
import { LinkButton } from "@/app/_components/LinkButton";
import { CheckboxInput } from "@/app/_components/CheckboxInput";
import Label from "@/app/_components/Label";
import TextArea from "@/app/_components/TextArea";

export default function Page() {
  const { token, session, isLoading } = useSupabaseSession()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
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

  //データの送信
  const accountDeleteSubmit = async (data: accountDeleteForm) => {

      try {
        const { data: authData, error } = await supabase.auth.getSession();
      // console.log(authData);

        if (!token) return;

        if ( error || !authData.session ) {
          setError("root", {
            message: "ユーザー情報が見つかりませんでした"
          });
          return;
        }

        const res = await fetch("/api/account/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          }
        })

        if (!res.ok) {
          console.error("退会処理に失敗しました")
          return
        }
        alert("退会処理が完了しました")

        await supabase.auth.signOut();
        router.replace("/sign_up")

      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("エラーが発生しました");
        }
      }

  }

  return (
    <div className='flex justify-center pt-60 pb-30'>
      {!isLoading && (
        <div>
          {session && (
            <form onSubmit={handleSubmit(accountDeleteSubmit)} className='space-y-4 w-full max-w-100'>
              <div className='mb-8 text-center space-y-4'>
                <p className='text-xl font-medium'>本当に削除しますか？</p>
                <p className='text-primary text-sm font-medium'>
                  アカウントを削除すると、プロフィール・お気に入り・閲覧履歴は削除され、復元できません。
                  なお、他のお客様の参考となるよう、投稿した口コミは匿名化された状態でサービス上に残ります。
                </p>
              </div>
              <div className='space-y-6'>
                <h2>
                  <span className='inline-block'>退会の理由をお聞かせください</span>
                  <span className='inline-block text-caution text-xs font-bold'>＊必須</span>
                </h2>
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
