'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInSchema, type SignInForm } from "@/app/_libs/schemas/signIn.schema";
import { TextInput } from "@/app/_components/TextInput";
import Label from "@/app/_components/Label";
import { Button } from "@/app/_components/button";

export default function Page() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: {
      errors,
      isSubmitting,
    }
  } = useForm<SignInForm>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });



  const signUpSubmit = async (data:SignInForm) => {

      const {email, password} = data
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if ( error ) {
        setError("root", {
          message: "メールアドレスまたはパスワードが正しくありません"
        });

      } else {
        router.replace("/")
        // console.log("送信データ", data);
        reset({
          email: "",
          password: "",
        });
      }
  }

  return (
    <div className='flex items-center justify-center flex-col pt-60'>
      {errors.root && (
        <p className="text-caution text-md pb-4">
          {errors.root.message}</p>
      )}
      <form onSubmit={handleSubmit(signUpSubmit)} className='space-y-4 w-full max-w-100'>
        <div className='space-y-2'>
          <Label htmlFor='email'>
              メールアドレス
          </Label>
          <TextInput
            {...register("email")}
            type='email'
            id='email'
            placeholder="メールアドレスを入力"
            className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
          />
          {errors.email && (
            <p className="text-caution text-sm">
              {errors.email.message}</p>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='password'>
              パスワード（半角英数字6文字以上）
          </Label>
          <TextInput
            {...register("password")}
            type='password'
            id='password'
            placeholder='パスワードを入力'
            className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
          />
          {errors.password && (
            <p className="text-caution text-sm font-bold">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className='text-right'>
          <p className='text-primary font-medium'>パスワードをお忘れの方は<Link href={"/resetPassword/sendEmail"} className='text-secondary font-bold'>こちら</Link></p>
        </div>
        <div>
          <Button type="submit" disabled={isSubmitting}>ログイン</Button>
        </div>
      </form>
      <div className='mt-10 text-center'>
        <p className='text-primary font-medium'>アカウントをお持ちでないですか？</p>
        <p className='text-primary font-medium'>新規登録は<Link href={"/sign_up"} className='text-secondary font-bold'>こちら</Link></p>
      </div>
    </div>
  )
}
