'use client'

import { useForm, useFieldArray, useWatch  } from "react-hook-form";
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
import { RadioBtnInput } from "@/app/_components/RadioBtnInput";
import Label from "@/app/_components/Label";
import TextArea from "@/app/_components/TextArea";
import { Button } from "@/app/_components/Button";
import { BaseSelect } from "@/app/_components/BaseSelect";
import { PrefectureSelect } from "@/app/_components/PrefectureSelect";
import { createNumberOptions } from "@/app/_libs/selectOptions";
import Image from "next/image";
import { Star } from "lucide-react";


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
      postsImageUrl: "",
      children: [
        {
          ageGroup: "0_2",
          count: 0
        },
        {
          ageGroup: "3_5",
          count: 0
        },
        {
          ageGroup: "6_plus",
          count: 0
        },
      ],
      rating:0,
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

  const ageGroupLabel = {
    "0_2": "0-2歳",
    "3_5": "3-5歳",
    "6_plus": "6歳～",
  } as const;

  const children = useWatch({
    control,
    name:"children"
  })

  const handleIncrease = (index: number) => {
    const currentCount = children[index].count;

    setValue(
      `children.${index}.count`,
      currentCount + 1
    );
  };

  const handleDecrease = (index: number) => {
    const currentCount = children[index].count;

    setValue(
      `children.${index}.count`,
      Math.max(
        0,
        currentCount - 1
      )
    );
  };


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

  //データの送信
  const postsSubmit = async (data: PostsForm) => {
    const postChildren = data.children.flatMap(
      (child) => Array.from(
        { length: child.count },
        () => ({
          age_Group: child.ageGroup,
        })
      )
    );
    console.log(postChildren);

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
          <Label className="text-xl font-medium text-primary input-bg-secondary rounded-full hover:bg-[#A3EED8] hover:text-[rgb(31,110,93)] cursor-pointer" key={usageScene.id}>
            <RadioBtnInput
              value={usageScene.id}
              {...register("usageScenes")}
              className='peer sr-only rounded-full input-bg-secondary'
            />
            <span className="inline-block text-xl font-medium text-primary px-5 py-2.5 w-full rounded-full input-bg-secondary hover:bg-[#A3EED8] transition-colors peer-checked:bg-[#A3EED8] peer-checked:text-[#1F6E5D]">
              {usageScene.label}
            </span>
          </Label>
          ))}
        </div>
      </div>
      <div className='posts-bg-primary rounded-[calc(32/16*1rem)] p-6 space-y-4'>
        <h3 className='text-2xl font-medium'>同伴した子供の詳細</h3>
        <div className="flex gap-2 justify-between">
          <p className="max-w-[147px]">年齢</p>
          <p className="max-w-[147px]">人数</p>
        </div>
        { children.map((child, index) =>(
          <div className="flex gap-2 justify-between" key={child.ageGroup}>
            <p className="pt-1">{ ageGroupLabel[child.ageGroup] }</p>
            <div className="flex items-center">
              <Button type="button" onClick={() => handleDecrease(index)} className="w-8 h-8 rounded-full p-0 text-2xl posts-countBtn"> - </Button>
              <span className="px-4">{ child.count}</span>
              <Button type="button" onClick={() => handleIncrease(index)} className="w-8 h-8 rounded-full p-0 text-2xl posts-countBtn"> + </Button>
            </div>
          </div>
        ))}
      </div>
      <div className='posts-bg-primary rounded-[calc(32/16*1rem)] p-6 space-y-4'>
        <h3 className='text-2xl font-medium'>オススメ度</h3>
        <div>
          <CheckboxInput
            type="hidden"
            {...register("rating")}
          />
          <div className="flex gap-1">
            {[1, 2, 3].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setValue("rating", star, {
                  shouldValidate: true,
                  shouldDirty: true,
                })}
              >
                <Star className={`size-6 transition-colors ${
                    star <= watch("rating")
                      ? "posts-star-fill-active posts-star-text"
                      : "posts-star-fill posts-star-text"
                  }
                `}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className='posts-bg-primary rounded-[calc(32/16*1rem)] p-6 space-y-4'>
        <h3 className='text-2xl font-medium'>コメント</h3>
        <div className="max-w-[294px] w-[calc(294/768*100vw)]">
          <Label htmlFor='comment' className="sr-only">
              コメント
          </Label>
          <TextArea
            {...register("comment")}
            id="comment"
            placeholder="お店の雰囲気や注意点など、自由に記入してください"
            className="input-bg-secondary"
          />
        </div>
      </div>
    </div>
  )
}
