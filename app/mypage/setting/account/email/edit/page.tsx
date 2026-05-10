'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { changeEmailSchema, type changeEmailForm } from "@/app/_libs/schemas/changeEmail.schema";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSettion";
import { TextInput } from "@/app/_components/TextInput";
import Label from "@/app/_components/Label";
import { Button } from "@/app/_components/Button";


export default function Page() {

  const {session, isLoading} = useSupabaseSession();

  //RFHとzodの設定
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: {
      errors,
      isSubmitting,
    }
  } = useForm<changeEmailForm>({
    mode: "onChange",
    defaultValues: {
      currentEmail:"",
      newEmail: "",
    },
    resolver: zodResolver(changeEmailSchema),
  });


  //メールアドレスの取得
  useEffect(() => {
    const fetchUserEmail = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        setError("root", {
          message: "エラーが発生しました。"
        });
        return;
      }

      if (!data.user?.email) {
        setError("root", {
          message: "メールアドレスを取得できませんでした"
        });
        return;
      }
      setValue("currentEmail", data.user.email);

    };

    fetchUserEmail();
  }, [setValue]);



  //新しいメールアドレス宛にメールを送信
  const changeEmailSubmit = async(data:changeEmailForm) => {
    const { newEmail } = data;
    const { data: getUser } = await supabase.auth.getUser();
    const currentEmail = getUser.user?.email;

    //現在のメールアドレスと新しいメールアドレスが同じかチェック
    if (newEmail === currentEmail) {
      setError("root", {
        message: "同じメールアドレスに変更できません"
      });
      return;
    }

    //新しいメールアドレスに変更するメールを送信
    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (error) {
      //メール送信確認用のエラーメッセージ
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
    <div>
      {!isLoading && (
        <div>
          {session && (
            <div className='flex items-center justify-center flex-col pt-60'>
              {errors.root && (
                <p className="text-caution text-md pb-4">
                  {errors.root.message}
                </p>
              )}
              <form onSubmit={handleSubmit(changeEmailSubmit)} className='space-y-4 w-full max-w-100'>
                <div className='space-y-2'>
                  <Label htmlFor='currentEmail'>
                      現在のメールアドレス
                  </Label>
                  <TextInput
                    {...register("currentEmail")}
                    type='email'
                    id='currentEmail'
                    readOnly
                    className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
                  />
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
          )}
      </div>
      )}
    </div>
  )
}
