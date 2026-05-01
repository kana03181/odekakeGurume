'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInSchema, type SignInForm } from "@/app/_libs/schemas/signIn.schema";
import { TextInput } from "@/app/_components/TextInput";


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
    },
    resolver: zodResolver(signInSchema),
  });



  const sendEmailSubmit = async (data:SignInForm) => {
    console.log("submitされてる？");

    const { email } = data;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/resetPassword/sendEmail`,
    });

    if ( error ) {
      setError("root", {
        message: "パスワード再設定メールの送信に失敗しました"
      });
      console.log((error));


    } else {
      console.log("成功");
      alert("パスワード再設定メールの送信しました")
      router.replace("/resetPassword/sendEmail")
      reset({
        email: "",
      });
    }
  }

  return (
    <div className='flex items-center justify-center flex-col pt-60'>
      <div className='text-center mb-4'>
        <p className='text-[#1D1B19] font-medium text-xl'>パスワードのリセット</p>
        <p className='text-[#544437] font-medium '>パスワード再設定用のリンクを送信します。登録しているメールアドレスを入力してください。</p>
      </div>
      {errors.root && (
        <p className="text-red-700 text-md pb-4">
          {errors.root.message}</p>
      )}
      <form onSubmit={handleSubmit(sendEmailSubmit)} className='space-y-4 w-full max-w-100'>
        <div className='space-y-2'>
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
        <Link href={"/sign_in"} className='text-[#FF9F43] font-medium'>ログインに戻る</Link>
      </div>
    </div>
  )
}
