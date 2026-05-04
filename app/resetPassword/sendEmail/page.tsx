'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { resetPasswordSchema, type resetPasswordForm } from "@/app/_libs/schemas/resetPassword.schema";
import { TextInput } from "@/app/_components/TextInput";
import { Button } from "@/app/_components/button";


export default function Page() {

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: {
      errors,
      isSubmitting,
    }
  } = useForm<resetPasswordForm>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const sendEmailSubmit = async (data:resetPasswordForm) => {
    // console.log("submitされたよ");

    const { email } = data;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/resetPassword/setting`,
    });

    if ( error ) {
      setError("root", {
        message: "パスワード再設定メールの送信に失敗しました"
      });

    } else {
      // console.log("送信成功");
      alert("パスワード再設定メールの送信しました")
      reset({
        email: "",
      });
    }
  }

  return (
    <div className='flex items-center justify-center flex-col pt-60'>
      <div className='text-center mb-4'>
        <p className='font-medium text-xl'>パスワードのリセット</p>
        <p className='text-primary font-medium text-md'>パスワード再設定用のリンクを送信します。登録しているメールアドレスを入力してください。</p>
      </div>
      {errors.root && (
        <p className="text-caution text-md pb-4">
          {errors.root.message}
        </p>
      )}
      <form onSubmit={handleSubmit(sendEmailSubmit)} className='space-y-4 w-full max-w-100'>
        <div className='space-y-2'>
          <TextInput
            {...register("email")}
            type='email'
            id='email'
            placeholder="メールアドレスを入力"
            className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
          />
          {errors.email && (
            <p className="text-caution text-sm">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <Button type="submit" disabled={isSubmitting}>送信</Button>
        </div>
      </form>
      <div className='mt-10 text-center'>
        <Link href={"/sign_in"} className='text-secondary font-medium'>ログインに戻る</Link>
      </div>
    </div>
  )
}
