'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInSchema, type SignInForm } from "@/app/_libs/schemas/signIn.schema";
import { TextInput } from "@/app/_components/TextInput";
import Label from "@/app/_components/Label";


export default function Page() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    // watch,
    formState: {
      errors,
      isSubmitting,
      // isValid,
    }
  } = useForm<SignInForm>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      // agree: false,
    },
    resolver: zodResolver(signInSchema),
  });

  // const isAgreed = watch("agree");
  // const isEnabled = isValid && isAgreed;


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
        <p className="text-red-700 text-md pb-4">
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
            className='bg-[#F8F7F5] text-[#1D1B19] placeholder-[#B4A89F] block w-full p-2.5'
          />
          {errors.email && (
            <p className="text-red-500 text-sm">
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
            className='bg-[#F8F7F5] text-[#1D1B19] placeholder-[#B4A89F] block w-full p-2.5'
          />
          {errors.password && (
            <p className="text-red-500 text-sm">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className='text-right'>
          <p className='text-[#544437] font-medium'>パスワードをお忘れの方は<Link href={"/"} className='text-[#FF9F43] font-bold'>こちら</Link></p>
        </div>
        <div>
          <button
            type='submit'
            disabled={isSubmitting}
            className= "w-full text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[calc(48/16*1rem)] text-[calc(18/16*1rem)] leading-normal px-5 py-[calc(16/16*1rem)] text-center bg-[#FF9F43] hover:bg-[#FBB97B]"
          >
            ログイン
          </button>
        </div>
      </form>
      <div className='mt-10 text-center'>
        <p className='text-[#544437] font-medium'>アカウントをお持ちでないですか？</p>
        <p className='text-[#544437] font-medium'>新規登録は<Link href={"/sign_up"} className='text-[#FF9F43] font-bold'>こちら</Link></p>
      </div>
    </div>
  )
}
