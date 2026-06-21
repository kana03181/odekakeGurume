'use client'

import { useFormContext, useWatch } from "react-hook-form";
// import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { ChangeEvent, useEffect} from "react";
import { usePublicFetch } from "@/app/_hooks/usePublicFetch";
import { GetFeatureResponse } from "@/app/api/features/route";
import { postsSchema, type PostsForm } from "@/app/_libs/schemas/posts.schema";
import { childFriendlyVoteOptions } from "@/app/_constants/childFriendlyVoteOptions";
import { TextInput } from "@/app/_components/TextInput";
import { CheckboxInput } from "@/app/_components/CheckboxInput";
import { RadioBtnInput } from "@/app/_components/RadioBtnInput";
import Label from "@/app/_components/Label";
import { Button } from "@/app/_components/Button";
import Image from "next/image";

type Props = {
  onPrev: () => void;
}


export default function Step2Form({ onPrev }: Props) {
  // const { token, isLoading: isSessionLoading } = useSupabaseSession()


  //RFHの設定
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    trigger,
    control,
    formState: {
      errors,
      isSubmitting,
    }
  } = useFormContext<PostsForm>();

    //利用シーンをAPIから取得
    const { data: meals } = usePublicFetch<GetFeatureResponse>("/api/features?category=お食事")
    // console.log(meals);

    //option変換
    const mealOptions = meals?.map((meal) => ({
      label: meal.name,
      value: String(meal.id),
    })) ?? [];
    // console.log(mealOptions);

    //設備をAPIから取得
    const { data: facilities } = usePublicFetch<GetFeatureResponse>("/api/features?category=設備")
    // console.log(facilities);

    //option変換
    const facilityOptions = facilities?.map((facility) => ({
      label: facility.name,
      value: String(facility.id),
    })) ?? [];
    // console.log(facilityOptions);

    //その他をAPIから取得
    const { data: others } = usePublicFetch<GetFeatureResponse>("/api/features?category=その他")
    // console.log(facilities);

    //option変換
    const otherOptions = others?.map((other) => ({
      label: other.name,
      value: String(other.id),
    })) ?? [];
    // console.log(otherOptions);


  return (
    <div className='space-y-8 w-full max-w-100'>
      <div className="w-fit mx-auto mb-6 text-center">
        <p className="text-left">利用したお店につきまして、<br/>該当するものを選択してください。</p>
      </div>
      <div className="space-y-8">
        <div className='posts-bg-primary rounded-[calc(32/16*1rem)] p-6 space-y-4'>
          <h3 className='text-2xl font-medium'>お食事について</h3>
            <div className="flex gap-2 flex-wrap">
              {mealOptions.map((meal) => (
                <Label className="text-md font-medium text-primary input-bg-secondary rounded-full hover:bg-[#A3EED8] hover:text-[rgb(31,110,93)] cursor-pointer" key={meal.value}>
                  <CheckboxInput
                    value={meal.value}
                    {...register("meals")}
                    className='peer sr-only rounded-full input-bg-secondary'
                  />
                  <span className="inline-block text-sm font-medium text-primary px-5 py-2.5 w-full rounded-full input-bg-secondary hover:bg-[#A3EED8] transition-colors peer-checked:bg-[#A3EED8] peer-checked:text-[#1F6E5D]">
                    {meal.label}
                  </span>
                </Label>
              ))}
            </div>
        </div>
        <div className='posts-bg-primary rounded-[calc(32/16*1rem)] p-6 space-y-4'>
          <h3 className='text-2xl font-medium'>設備の確認</h3>
            <div className="flex gap-2 flex-wrap">
              {facilityOptions.map((facility) => (
                <Label className="text-md font-medium text-primary input-bg-secondary rounded-full hover:bg-[#A3EED8] hover:text-[rgb(31,110,93)] cursor-pointer" key={facility.value}>
                  <CheckboxInput
                    value={facility.value}
                    {...register("facilities")}
                    className='peer sr-only rounded-full input-bg-secondary'
                  />
                  <span className="inline-block text-sm font-medium text-primary px-5 py-2.5 w-full rounded-full input-bg-secondary hover:bg-[#A3EED8] transition-colors peer-checked:bg-[#A3EED8] peer-checked:text-[#1F6E5D]">
                    {facility.label}
                  </span>
                </Label>
              ))}
            </div>
        </div>
        <div className='posts-bg-primary rounded-[calc(32/16*1rem)] p-6 space-y-4'>
          <h3 className='text-2xl font-medium'>その他</h3>
            <div className="flex gap-2 flex-wrap">
              {otherOptions.map((other) => (
                <Label className="text-md font-medium text-primary input-bg-secondary rounded-full hover:bg-[#A3EED8] hover:text-[rgb(31,110,93)] cursor-pointer" key={other.value}>
                  <CheckboxInput
                    value={other.value}
                    {...register("others")}
                    className='peer sr-only rounded-full input-bg-secondary'
                  />
                  <span className="inline-block text-sm font-medium text-primary px-5 py-2.5 w-full rounded-full input-bg-secondary hover:bg-[#A3EED8] transition-colors peer-checked:bg-[#A3EED8] peer-checked:text-[#1F6E5D]">
                    {other.label}
                  </span>
                </Label>
              ))}
            </div>
        </div>
        <div className='posts-bg-primary rounded-[calc(32/16*1rem)] p-6 space-y-4'>
          <h3 className='text-2xl font-medium text-center'>子供連れへの優しさは？</h3>
          <div className="flex gap-4 items-center justify-center">
            {childFriendlyVoteOptions.map((option) => (
              <Label className="grid place-items-center cursor-pointer" key={option.value}>
                <RadioBtnInput
                  value={option.value}
                  {...register("childFriendlyVote")}
                  className='peer sr-only'
                />

                <div className='w-fit input-bg-secondary p-6 rounded-full transition-colors peer-checked:bg-[#A3EED8]'>
                  <Image
                    src={option.value === "true" ? "/posts/good.svg" : "/posts/bad.svg"}
                    alt={option.value === "true" ? "親指を立てるアイコン" : "親指を下げるアイコン"}
                    width={30}
                    height={30}
                    loading='lazy'
                  />
                </div>

                <span className="inline-block text-sm font-medium text-primary px-4 pt-2 w-full ">
                  {option.label}
                </span>
              </Label>
            ))}
            </div>
        </div>
      </div>
      <Button type="submit">投稿する</Button>
    </div>
  )
}
