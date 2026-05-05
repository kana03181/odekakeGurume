'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { userSchema, type UserForm } from "@/app/_libs/schemas/user.schema";
import { TextInput } from "@/app/_components/TextInput";
import Label from "@/app/_components/Label";
import { Button } from "@/app/_components/Button";

export default function Page() {

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {
      errors,
      isSubmitting,
      isValid,
    }
  } = useForm<UserForm>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      username: "",
      agree: false,
    },
    resolver: zodResolver(userSchema),
  });

  const isAgreed = watch("agree");
  const isEnabled = isValid && isAgreed;


  const signUpSubmit = async (data:UserForm) => {

      const {email, password, username} = data
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
          data: {
            user_name: username,
          },
        },
      })

      if ( error ) {
        console.error(error);
        alert(
          error.message.includes("already")
            ? "このメールアドレスは既に登録済みの可能性があります"
            : "登録に失敗しました"
        );

      } else {
        alert(`
        確認メールを送信しました。
        届かない場合は、すでに登録済みの可能性があります。
        ログインまたはパスワード再設定をお試しください。
        `)
        // console.log("送信データ", data);
        reset({
          email: "",
          password: "",
          username: "",
          agree: false,
        });
      }
  }

  return (
    <div className='flex justify-center pt-60'>
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
            <p className="text-caution text-sm font-bold">
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
        <div className='space-y-2'>
          <Label htmlFor='username'>
              ユーザー名（4文字以上）
          </Label>
          <TextInput
            {...register("username")}
            type='text'
            id='username'
            placeholder='ユーザー名を入力'
            className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
          />
          {errors.username && (
            <p className="text-caution text-sm font-bold">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className='flex items-center justify-start gap-x-1'>
          <input
            {...register("agree")}
            type="checkbox"
            id='agree'
            />
          <Label htmlFor="agree"
            className='block text-sm font-medium text-primary'>
              <Link href="/terms" className='text-secondary'>利用規約</Link>と<Link href="/privacy_policy" className='text-secondary'>プライバシーポリシー</Link>に同意する
          </Label>
        </div>
        {errors.agree && (
          <p className="text-caution text-sm font-bold">
            {errors.agree.message}
          </p>
        )}
        <div>
          <Button type="submit" disabled={!isEnabled || isSubmitting} variant={isEnabled ? "primary" : "disabled" }>
            送信
          </Button>
        </div>
      </form>
    </div>
  )
}
