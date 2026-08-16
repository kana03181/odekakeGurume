'use client'

import { useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { PostsForm } from "@/app/_libs/schemas/posts.schema";
import Step1Form from "@/app/posts/new/_components/Step1Form"
import Step2Form from "@/app/posts/new/_components/Step2Form"
import { StepIndicator } from "@/app/posts/new/_components/StepIndicator"
import { usePostForm } from "@/app/posts/new/_hook/usePostForm"
// import { CreatePostResponse } from "@/app/api/posts/route"
import { createPostChildren } from "@/app/_libs/createPostChildren";
import { type CreatePostResponse, type CreatePostRequestBody } from "@/app/_types/posts";


export default function NewPostPage() {
  const { token, isLoading: isSessionLoading } = useSupabaseSession()
  const [step, setStep] = useState<1 | 2>(1)
  const { methods } = usePostForm();

  const router = useRouter()


  const postsSubmit = async (data: PostsForm) => {
    if (!token) return;

    try {
      const body: CreatePostRequestBody = {
        shopId: 3,
        visitedDate: new Date(data.visitedDate),
        postImages: data.postsImageUrl.map((imageUrl) => ({
          imageUrl
        })),
        postFeatures: [
          { featureId: Number(data.usageScenes) },
          ...data.meals.map((id) => ({ featureId: Number(id) })),
          ...data.facilities.map((id) => ({ featureId: Number(id) })),
          ...(data.others ?? []).map((id) => ({ featureId: Number(id) })),
        ],

        postChildren: createPostChildren(data.children),
        rating: Number(data.rating),
        comment: data.comment,
        childFriendlyVote: data.childFriendlyVote === "true",
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message);
      }

      const result:CreatePostResponse = await res.json()

      alert("投稿完了しました！")
      router.replace(`/posts/${result.id}`)
      methods.reset();

    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }else {
        alert("投稿に失敗しました");
      }
    }

  }

  return (
    <FormProvider {...methods}>
      <div className="flex items-center justify-center flex-col pt-60">
        <h2 className="text-3xl font-medium">口コミ投稿</h2>
        <StepIndicator step={step} />
        <form onSubmit={methods.handleSubmit(postsSubmit)} className='space-y-8 w-full max-w-100'>
          {step === 1 && (
            <Step1Form onNext={() => setStep(2)}/>
          )}

          {step === 2 && (
            <Step2Form onPrev={() => setStep(1)}/>
          )}
        </form>
      </div>
    </FormProvider>
  )
}
