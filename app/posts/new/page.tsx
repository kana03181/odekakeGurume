'use client'

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
import { postsSchema, type PostsForm } from "@/app/_libs/schemas/posts.schema";
import { TextInput } from "@/app/_components/TextInput";
import { ImageInput } from "@/app/_components/ImageInput";
import { DateInput } from "@/app/_components/DateInput";
import { CheckboxInput } from "@/app/_components/CheckboxInput";
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
  } = useForm<PostsForm>({
    mode: "onChange",
    defaultValues: {
      shopName: "",
      comment: "",
      postsImageUrl:"",
    },
    resolver: zodResolver(postsSchema),
  });

  const usageSceneOptions = [
    {
      id: "morning",
      label: "朝ごはん",
    },
    {
      id: "lunch",
      label: "昼ごはん",
    },
    {
      id: "dinner",
      label: "夜ごはん",
    },
    {
      id: "break",
      label: "カフェ・休憩",
    }
  ]

  // 画像URL取得
  const postsImageKey = watch("postsImageUrl");

  const postsImageUrl = useStorageImage({
    bucket: "posts_thumbnail",
    imageKey: postsImageKey
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
    setValue("postsImageUrl", imagePath, {
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
        <div className='posts-bg-primary rounded-[calc(32/16*1rem)] p-6 space-y-4'>
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
          <div className='flex items-center justify-center gap-3 '>
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
        <div>
          <p className='mb-4 text-sm font-medium text-primary'>写真を追加（最大3枚まで）</p>
            <div className='flex gap-3 items-center justify-between'>
              {[1, 2, 3].map((index) => (
                <Label className="cursor-pointer">
                  <ImageInput
                    onChange={handleImageChange}
                  />
                  <div className='grid w-fit place-items-center gap-2 p-5 border-dashed rounded-[calc(24/16*1rem)] border-2 border-[#DAC2B1] overflow-hidden posts-image-bg-primary'>
                    <div className='w-fit posts-image-bg-secondary p-2 rounded-full'>
                      <Image
                        src={postsImageUrl || "/posts/Icon_addPhoto.svg"}
                        alt="お店の写真"
                        width={22}
                        height={20}
                        loading='eager'
                      />
                    </div>
                    <p className='text-xs font-bold'>ADD PHOTO</p>
                  </div>
                </Label>
              ))}
            </div>
          </div>
      </div>
      <div className='posts-bg-primary rounded-[calc(32/16*1rem)] p-6 space-y-4'>
        <h3 className='text-2xl font-medium'>利用シーン</h3>
        <div className="flex gap-2 flex-wrap">
          {usageSceneOptions.map((usageScene) => (
          <Label className="text-xl font-medium text-primary px-5 py-2.5 input-bg-secondary rounded-full hover:bg-[#A3EED8] hover:text-[#1F6E5D] cursor-pointer" key={usageScene.id}>
            <CheckboxInput
              value={usageScene.id}
              {...register("usageScenes")}
              className='peer sr-only rounded-full input-bg-secondary'
              />
              <span className="inline-block text-xl font-medium text-primary w-full rounded-full input-bg-secondary hover:bg-[#A3EED8] transition-colors peer-checked:bg-[#A3EED8] peer-checked:text-[#1F6E5D]">
                {usageScene.label}
              </span>
          </Label>
          ))}
        </div>
      </div>
    </div>
  )
}
