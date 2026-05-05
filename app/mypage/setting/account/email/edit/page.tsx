'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { changeEmailSchema, type changeEmailForm } from "@/app/_libs/schemas/changeEmail.schema";
import { useSupabaseSession } from "@/app/_hook/useSupabaseSettion";
import { TextInput } from "@/app/_components/TextInput";
import Label from "@/app/_components/Label";
import { Button } from "@/app/_components/Button";
import { error } from 'console';


export default function Page() {
  const router = useRouter()

  const {session, isLoading} = useSupabaseSession();
  const [currentEmail, setCurrentEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //メールアドレスの取得
  useEffect(() => {
    const fetchUserEmail = async () => {
      const { data,error } = await supabase.auth.getUser();
      setCurrentEmail(data.user?.email ?? "");

      if (error) {
        setErrorMessage("メールアドレスを取得できませんでした");
        return;
      }
    }
    fetchUserEmail();
  }, []);

  //RFHとzodの設定
  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    }
  } = useForm<changeEmailForm>({
    mode: "onChange",
    defaultValues: {
      newEmail: "",
    },
    resolver: zodResolver(changeEmailSchema),
  });


  //新しいメールアドレス宛にメールを送信
  const changeEmailSubmit = async(data:changeEmailForm) => {
    const { newEmail } = data;
    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if ( error ) {
      if (error.message.includes("rate limit")) {
        setError("root", {
          message: "メールの送信に失敗しました。少し時間をおいて送信してください"
        });
      } else {
        setError("root", {
          message: "メールの送信に失敗しました。メールアドレスをもう一度ご確認ください"
        });
        console.error(error);
      }
    } else {
      setError("root", {
        message: "確認メールを送信しました。メールボックスをご確認ください。"
      });
    }
  }

  return (
    <div className='flex items-center justify-center flex-col pt-60'>
      {errors.root && (
        <p className="text-caution text-md pb-4">
          {errors.root.message}
        </p>
      )}
      <form onSubmit={handleSubmit(changeEmailSubmit)} className='space-y-4 w-full max-w-100'>
        <div className='space-y-2'>
          <Label htmlFor='newEmail'>
              現在のメールアドレス
          </Label>
          <TextInput
            value={currentEmail}
            type='email'
            className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
          />
          <div>
            {errorMessage && <p>{errorMessage}</p>}
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='newEmail'>
              新しいメールアドレス
          </Label>
          <TextInput
            {...register("newEmail")}
            type='email'
            id='newEmail'
            className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
          />
          {errors.newEmail && (
            <p className="text-caution text-sm">
              {errors.newEmail.message}
            </p>
          )}
        </div>
        <div>
          <Button type="submit" disabled={isSubmitting}>変更</Button>
        </div>
      </form>
    </div>
  )
}
