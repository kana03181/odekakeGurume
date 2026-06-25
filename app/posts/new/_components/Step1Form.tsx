'use client'

import { useFormContext, useWatch } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { ChangeEvent, useEffect} from "react";
import { uploadImage } from "@/app/_libs/uploadImage";
import { useStorageImage } from "@/app/_hooks/useStorageImage";
import { postsSchema, type PostsForm } from "@/app/_libs/schemas/posts.schema";
import { TextInput } from "@/app/_components/TextInput";
import { ImageInput } from "@/app/_components/ImageInput";
import { DateInput } from "@/app/_components/DateInput";
import { CheckboxInput } from "@/app/_components/CheckboxInput";
import Label from "@/app/_components/Label";
import TextArea from "@/app/_components/TextArea";
import { Button } from "@/app/_components/Button";
import { PrefectureSection } from "@/app/posts/new/_components/PrefectureSection";
import { UsageSceneSection } from "@/app/posts/new/_components/UsageSceneSection";
import { AgeGroupSection } from "@/app/posts/new/_components/AgeGroupSection";
import Image from "next/image";
import { Star } from "lucide-react";


type Props = {
  onNext: () => void;
}

export default function Step1Form({ onNext }:Props) {
  const { token, isLoading: isSessionLoading } = useSupabaseSession()

  //RFHの設定
  const {
    register,
    setValue,
    watch,
    trigger,
    formState: {
      errors,
    }
  } = useFormContext<PostsForm>();


  // アップロードできる画像の最大枚数を定数化
  const MAX_POST_IMAGE_COUNT = 3;

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

  // オススメ度の最大数を定数化
  const MAX_RATING = 3;
  const RATING_STARS = Array.from({ length: MAX_RATING }, (_, index) => index + 1);

  const rating = watch("rating") ?? 0;


  //次へボタン
  const handleNext = async () => {
    //1P目のバリデーションチェック
    const isValid = await trigger([
      "shopName",
      "visitedDate",
      "prefecture",
      // "postsImageUrl",
      "usageScenes",
      "rating",
      "comment"
    ]);

    if (!isValid) return;

    onNext();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div className='flex items-center justify-center flex-col gap-14'>

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
          </div>
          <PrefectureSection />
        </div>
        <div>
          <p className='mb-4 text-sm font-medium text-primary'>写真を追加（最大3枚まで）</p>
            <div className='flex gap-3 items-center justify-between'>
              {Array.from({ length: MAX_POST_IMAGE_COUNT }).map((_, index) => (
                <Label key={index} className="cursor-pointer">
                  <ImageInput
                    onChange={handleImageChange}
                  />
                  <div className='grid w-fit place-items-center gap-2 p-5 border-dashed rounded-[calc(24/16*1rem)] border-2 border-[#DAC2B1] overflow-hidden posts-image-bg-primary'>
                    <div className='w-fit posts-image-bg-secondary p-2 rounded-full'>
                      <Image
                        src={postsImageUrl || "/posts/addPhoto.svg"}
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
        <UsageSceneSection />
        <AgeGroupSection />
        <div className='posts-bg-primary rounded-[calc(32/16*1rem)] p-6 space-y-4'>
          <h3 className='text-2xl font-medium'>オススメ度</h3>
          <div>
            <CheckboxInput
              type="hidden"
              {...register("rating")}
            />
            <div className="flex gap-1">
              {/* {[1, 2, 3].map((star) => (
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
              ))} */}
              {RATING_STARS.map((star) => (
                <button
                  key={star}
                    type="button"
                    onClick={() => setValue("rating", rating === star ? 0 : star, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })}
                >
                  <Star className={`size-6 transition-colors ${
                      star <= rating
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
          <div>
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
        <div>
          <Button type="button" onClick={handleNext}>次へ</Button>
        </div>
      </div>

    </div>
  )
}
