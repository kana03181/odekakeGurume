'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { userSchema, type UserForm } from "@/app/_libs/schemas/user.schema";
import { TextInput } from "@/app/_components/TextInput";
import Label from "@/app/_components/Label";
import { useIsLocationState } from "@/app/resetPassword/_hook/useIsLocationState";
import { signInSchema } from '@/app/_libs/schemas/signIn.schema';

export default function Page() {
  useIsLocationState("/sign_in");

  //signInSchemaからメールアドレスを抽出
  const signInSchema = z.object({
    email: signInSchema.shape.email,
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: {
      errors,
      isSubmitting,
      isSubmitSuccessful,
    }
  } = useForm<SignInForm>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(signInSchema),
  });

  return (
    <div className='flex items-center justify-center flex-col pt-60'>
      {errors.root && (
        <p className="text-red-700 text-md pb-4">
          {errors.root.message}</p>
      )}
      <form onSubmit={handleSubmit(signUpSubmit)} className='space-y-4 w-full max-w-100'>
        <div>
          <div>
            <p className='text-md font-medium text-[#544437]'>パスワードのリセット</p>
            <p className='text-sm font-medium text-[#544437]'>パスワード再設定用のリンクを送信します。登録しているメールアドレスを入力してください。</p>
          </div>
          <TextInput
            {...register("password")}
            type='password'
            id='password'
            placeholder='パスワードを入力'
            className='bg-[#F8F7F5] text-[#1D1B19] placeholder-[#B4A89F] block w-full p-2.5'
          />
          {errors.password && (
            <p className="text-red-500 text-sm">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <button
            type='submit'
            disabled={isSubmitting}
            className= "w-full text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[calc(48/16*1rem)] text-[calc(18/16*1rem)] leading-normal px-5 py-[calc(16/16*1rem)] text-center bg-[#FF9F43] hover:bg-[#FBB97B]"
          >
            送信
          </button>
        </div>
      </form>
      <div className='mt-10 text-center'>
        <Link href={"/sign_in"} className='text-[#FF9F43] font-bold'>ログインに戻る</Link>
      </div>
    </div>
  );

}
