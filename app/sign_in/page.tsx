'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSupabaseSession } from "@/app/_hook/useSupabaseSettion";
// import { CreateUserRequestBody } from "@/app/api/sign_up/route";
import { useRouter } from "next/navigation";
import { signInSchema, type SignInForm } from "@/app/_libs/schemas/signIn.schema";
import { TextInput } from "@/app/_components/TextInput";
import Label from "@/app/_components/Label";
import { Button } from "@/app/_components/Button";

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
    const { email, password } = data

    const { data:authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if ( error || !authData.session ) {
      setError("root", {
        message: "メールアドレスまたはパスワードが正しくありません"
      });
      return;
    }

    const token = authData.session.access_token;
    const authHeader = `Bearer ${token}`;

    console.log("session:", authData.session)
    console.log("user:", authData.user)
    console.log("token:", authData.session.access_token)
    console.log("Authorization header:", authHeader);

    const userId = {
      supabaseUserId: authData.user.id,
    };

    console.log("送信データ:", userId);
    console.log("JSON:", JSON.stringify(userId));



    const res = await fetch("/api/sign_up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      body: JSON.stringify(userId),
    })

    console.log(res);


    if (!res.ok) {
      console.error(error)
      return
    }

    router.replace("/mypage/setting")
    reset({
      email: "",
      password: "",
    });


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
