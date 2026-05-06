'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { changePasswordSchema, type changePasswordForm } from "@/app/_libs/schemas/changePassword.schema";
import { useSupabaseSession } from "@/app/_hook/useSupabaseSettion";
import { TextInput } from "@/app/_components/TextInput";
import Label from "@/app/_components/Label";
import { Button } from "@/app/_components/Button";

export default function Page() {
  const router = useRouter()
  const {session, isLoading} = useSupabaseSession();

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    }
  } = useForm<changePasswordForm>({
    mode: "onChange",
    defaultValues: {
      currentPassword:"",
      newPassword: "",
      newPasswordConfirm: "",
    },
    resolver: zodResolver(changePasswordSchema),
  });

  const handleChangePassword = async (data:changePasswordForm) => {
    // console.log("submitされたよ");

    const { newPassword } = data;
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if ( error ) {
      setError("root", {
        message: "パスワードの変更に失敗しました"
      });

    } else {
      // console.log("パスワード再設定成功");
      alert("パスワードを変更しました");
      router.replace("/mypage/setting")
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
              <form onSubmit={handleSubmit(handleChangePassword)} className='space-y-4 w-full max-w-100'>
                <div className='space-y-2'>
                  <Label htmlFor='currentPassword'>
                      現在のパスワード（半角英数字6文字以上）
                  </Label>
                  <TextInput
                    {...register("currentPassword")}
                    type='password'
                    id='currentPassword'
                    className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
                  />
                  {errors.currentPassword && (
                    <p className="text-caution text-sm">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='newPassword'>
                      新しいパスワード（半角英数字6文字以上）
                  </Label>
                  <TextInput
                    {...register("newPassword")}
                    type='password'
                    id='newPassword'
                    className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
                  />
                  {errors.newPassword && (
                    <p className="text-caution text-sm">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='newPasswordConfirm'>
                      新しいパスワード（確認用）
                  </Label>
                  <TextInput
                    {...register("newPasswordConfirm")}
                    type='password'
                    id='newPasswordConfirm'
                    className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
                  />
                  {errors.newPasswordConfirm && (
                    <p className="text-caution text-sm">
                      {errors.newPasswordConfirm.message}
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
