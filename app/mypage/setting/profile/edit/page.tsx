'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { profileSchema, type ProfileForm } from "@/app/_libs/schemas/profile.schema";
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
  } = useForm<ProfileForm>({
    mode: "onChange",
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(profileSchema),
  });


  const signUpSubmit = async (data:ProfileForm) => {
    const { username } = data

    const { data: authData, error } = await supabase.auth.getUser();
    console.log(authData);


    // if ( error || !authData.session ) {
    //   setError("root", {
    //     message: "メールアドレスまたはパスワードが正しくありません"
    //   });
    //   return;
    // }

    // const token = authData.session.access_token;
    // const authHeader = `Bearer ${token}`;

    // const res = await fetch("/api/sign_in", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: authHeader,
    //     },
    // })

    // if (!res.ok) {
    //   console.error("エラーが発生しました")
    //   return;
    // }

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
              お名前
          </Label>
          <TextInput
            {...register("name")}
            type='name'
            id='name'
            className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
          />
          {errors.name && (
            <p className="text-caution text-sm">
              {errors.name.message}</p>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='username'>
              ユーザー名 ＊投稿した口コミに表示されます
          </Label>
          <TextInput
            {...register("username")}
            type='username'
            id='username'
            className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
          />
          {errors.username && (
            <p className="text-caution text-sm font-bold">
              {errors.username.message}
            </p>
          )}
        </div>
        <div>
          <Button type="submit" disabled={isSubmitting}>保存</Button>
        </div>
      </form>
    </div>
  )
}
