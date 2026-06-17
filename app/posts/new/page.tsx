'use client'

import { useState } from "react";
import { FormProvider } from "react-hook-form";

import Step1Form from "@/app/posts/new/_components/Step1Form"
// import Step2Form from "@/app/posts/new/_components/Step2Form"
import { StepIndicator } from "@/app/posts/new/_components/StepIndicator"
import { usePostForm } from "@/app/posts/new/_hook/usePostForm"


export default function NewPostPage() {
  const [step, setStep] = useState<1 | 2>(1)

  const {
    methods,
    postsSubmit,
  } = usePostForm();

  return (
    <FormProvider
      {...methods}
    >
      <div className="flex items-center justify-center flex-col pt-60">
          <h2 className="text-3xl font-medium">口コミ投稿</h2>
          <StepIndicator step={step} />
        <form onSubmit={methods.handleSubmit(postsSubmit)} className='space-y-8 w-full max-w-100'>
          <Step1Form onNext={() => setStep(2)}/>
          {/* <Step1Form onNext={() => setStep(2)}/> */}
        </form>
      </div>
    </FormProvider>
  )
}
