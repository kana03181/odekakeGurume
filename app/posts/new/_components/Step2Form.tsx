'use client'

import { useFormContext } from "react-hook-form";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { type PostsForm } from "@/app/_libs/schemas/posts.schema";
import { childFriendlyVoteOptions } from "@/app/_constants/childFriendlyVoteOptions";
import { RadioBtnInput } from "@/app/_components/RadioBtnInput";
import Label from "@/app/_components/Label";
import { Button } from "@/app/_components/Button";
import { MealSection } from "@/app/posts/new/_components/MealSection";
import { FacilitySection } from "@/app/posts/new/_components/FacilitySection";
import { OtherSection } from "@/app/posts/new/_components/OtherSection";
import Image from "next/image";

type Props = {
  onPrev: () => void;
}

export default function Step2Form({ onPrev }: Props) {
  const { token, isLoading: isSessionLoading } = useSupabaseSession()
  // const router = useRouter()


  //RFHの設定
  const {
    register,
    formState: {
      isSubmitting,
    }
  } = useFormContext<PostsForm>();

  return (
    <div className='space-y-8 w-full max-w-100'>
      <div className="w-fit mx-auto mb-6 text-center">
        <p className="text-left">利用したお店につきまして、<br/>該当するものを選択してください。</p>
      </div>
      <div className="space-y-8">
        <MealSection/>
        <FacilitySection/>
        <OtherSection/>
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
      <Button type="submit" disabled={isSubmitting}>投稿する</Button>
    </div>
  )
}
