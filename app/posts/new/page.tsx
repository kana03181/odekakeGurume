'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm, useFieldArray  } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect} from "react";
import { UpdateProfileRequestBody } from "@/app/api/profile/route";
import { GetProfileResponse } from "@/app/api/profile/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useFetch } from "@/app/_hooks/useFetch";
import { uploadImage } from "@/app/_libs/uploadImage";
import { useStorageImage } from "@/app/_hooks/useStorageImage";
import { postSchema, type PostForm } from "@/app/_libs/schemas/post.schema";
import { TextInput } from "@/app/_components/TextInput";
import { DateInput } from "@/app/_components/DateInput";
import Label from "@/app/_components/Label";
import { Button } from "@/app/_components/Button";
import { BaseSelect } from "@/app/_components/BaseSelect";
import { PrefectureSelect } from "@/app/_components/PrefectureSelect";
import { createNumberOptions } from "@/app/_libs/selectOptions";
import Image from "next/image";


export default function Page() {
  const { token, isLoading: isSessionLoading } = useSupabaseSession()
  // const router = useRouter()

  //RFHの設定
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    control,
    formState: {
      errors,
      isSubmitting,
    }
  } = useForm<PostForm>({
    mode: "onChange",
    defaultValues: {
      shopName: "",
      comment: "",
      postImageUrl:"",
    },
    resolver: zodResolver(postSchema),
  });


  // 画像URL取得
  const postImageKey = watch("postImageUrl");

  const postImageUrl = useStorageImage({
    bucket: "profile_thumbnail",
    imageKey: postImageKey
  });


  // 画像アップロード
  const handleImageChange = async (
    event:ChangeEvent<HTMLInputElement>
  ):Promise<void> => {
    if (!event.target.files?.length) {
      return
    }

    try {
      const file = event.target.files[0];

      const imagePath = await uploadImage({
        file,
        bucket:"profile_thumbnail"
      })

    // RHFに値をセット
    setValue("postImageUrl", imagePath, {
      shouldDirty: true,
      shouldValidate: true,
    })

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("エラーが発生しました");
      }
    }
  }


  return (
    <div className='flex items-center justify-center flex-col pt-60 gap-14'>
      <h2 className='text-3xl font-medium'>口コミ投稿</h2>

      <div className='space-y-8 w-full max-w-100'>
        <div>
          <h3 className='text-2xl font-medium'>どこで食べましたか？</h3>
          <div className='space-y-2'>
            <Label htmlFor='shopname'>
                店名
            </Label>
            <TextInput
              {...register("shopName")}
              type='text'
              id='shopName'
              className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
            />
            {errors.shopName && (
              <p className="text-caution text-sm font-bold">
                {errors.shopName.message}
              </p>
            )}
          </div>
          <div className='flex items-center justify-center gap-3'>
            <div className='space-y-2'>
              <Label htmlFor='visitedDate'>
                  来店日
              </Label>
              <DateInput
                {...register("visitedDate")}
                id='visitedDate'
                className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
              />
              {errors.visitedDate && (
                <p className="text-caution text-sm font-bold">
                  {errors.visitedDate.message}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='Prefecture'>
                  都道府県
              </Label>
              <PrefectureSelect
                {...register("prefecture")}
                id='prefecture'
                className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
              />
              {errors.prefecture && (
                <p className="text-caution text-sm font-bold">
                  {errors.prefecture.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
