'use client'

import { StepIndicator } from "@/app/posts/new/_components/StepIndicator"

import { useState } from "react";

export default function NewPostPage() {
  const [step, setStep] = useState<1 | 2>(1)

  return (
    <>
      <StepIndicator step={step} />
    </>
  )
}
