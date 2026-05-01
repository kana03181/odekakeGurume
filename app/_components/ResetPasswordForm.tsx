import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { TextInput } from "@/app/_components/TextInput";
import { supabase } from '@/app/_libs/supabase'
import { Control, FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormReset } from "react-hook-form";

type Props = {
  control: Control<{email: string} >;
  errors: FieldErrors<{email: string} >;
  handleSubmit: UseFormHandleSubmit<{email: string} >;
  reset: UseFormReset<{ email: string }>;
  isSubmitting: boolean;
}

export const ResetPasswordForm = ({
  errors,
  handleSubmit,
  reset,
  isSubmitting
}: Props) => {
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    navigate("/sign_in");
  }, [navigate]);

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    const { email } = data;
    const token = uuidv4();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/resetPassword/${token}`,
      });

      if (error) {
        throw new Error(error.message);
      }
      alert("パスワード再設定メールを送信しました。メールを確認してください。")

    } catch (err) {
      console.log(err);

    } finally {
      reset();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 w-full max-w-100'>
      <div className='space-y-2'>
        <TextInput
          type='email'
          id='email'
          placeholder="メールアドレスを入力"
          className='bg-[#F8F7F5] text-[#1D1B19] placeholder-[#B4A89F] block w-full px-8 py-4'
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
  );
}
