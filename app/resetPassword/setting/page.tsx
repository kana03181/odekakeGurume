'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { settingPasswordSchema, type settingPasswordForm } from "@/app/_libs/schemas/settingPassword.schema";
import { TextInput } from "@/app/_components/TextInput";
import Label from "@/app/_components/Label";

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
  } = useForm<settingPasswordForm>({
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      newPasswordConfirm: "",
    },
    resolver: zodResolver(settingPasswordSchema),
  });

  const sendEmailSubmit = async (data:settingPasswordForm) => {
    // console.log("submitされたよ");

    const { newPassword } = data;
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if ( error ) {
      setError("root", {
        message: "パスワードの再設定に失敗しました"
      });
      throw new Error(error.message);

    } else {
      // console.log("パスワード再設定成功");
      alert("パスワードを再設定しました")
      reset({
        newPassword: "",
        newPasswordConfirm: "",
      });
      router.replace("/sign_in")
    }
  }

  return (
    <div className='flex items-center justify-center flex-col pt-60'>
      <div className='text-center mb-4'>
        <p className='text-[#1D1B19] font-medium text-xl'>パスワードの再設定</p>
        <p className='text-[#544437] font-medium '>新しいパスワードを入力してください。</p>
      </div>
      {errors.root && (
        <p className="text-red-700 text-md pb-4">
          {errors.root.message}
        </p>
      )}
      <form onSubmit={handleSubmit(sendEmailSubmit)} className='space-y-4 w-full max-w-100'>
        <div className='space-y-2'>
          <Label htmlFor='newPassword'>
              新しいパスワード（半角英数字6文字以上）
          </Label>
          <TextInput
            {...register("newPassword")}
            type='text'
            id='newPassword'
            className='bg-[#F8F7F5] text-[#1D1B19] placeholder-[#B4A89F] block w-full p-2.5'
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm">
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='newPasswordConfirm'>
              パスワード（確認）
          </Label>
          <TextInput
            {...register("newPasswordConfirm")}
            type='text'
            id='newPasswordConfirm'
            className='bg-[#F8F7F5] text-[#1D1B19] placeholder-[#B4A89F] block w-full p-2.5'
          />
          {errors.newPasswordConfirm && (
            <p className="text-red-500 text-sm">
              {errors.newPasswordConfirm.message}
            </p>
          )}
        </div>
        <div>
          <button
            type='submit'
            disabled={isSubmitting}
            className= "w-full text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[calc(48/16*1rem)] text-[calc(18/16*1rem)] leading-normal px-5 py-[calc(16/16*1rem)] text-center bg-[#FF9F43] hover:bg-[#FBB97B]"
          >
            変更
          </button>
        </div>
      </form>
    </div>
  )
}
