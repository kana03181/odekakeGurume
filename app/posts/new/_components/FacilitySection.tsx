import { useFormContext, useWatch } from "react-hook-form";
import { usePublicFetch } from "@/app/_hooks/usePublicFetch";
import { GetFeatureResponse } from "@/app/api/features/route";
import { type PostsForm } from "@/app/_libs/schemas/posts.schema";
import { CheckboxInput } from "@/app/_components/CheckboxInput";
import Label from "@/app/_components/Label";

export const FacilitySection = () => {
  const {
    register,
    formState: {
      errors,
    }
  } = useFormContext<PostsForm>();

    //設備をAPIから取得
    const { data: facilities, error: facilitiesError  } = usePublicFetch<GetFeatureResponse>("/api/features?category=設備")

    if (facilitiesError) {
      return <p>読み込みに失敗しました</p>
    }

    if (!facilities) {
      return <p>読み込み中</p>
    }

    //option変換
    const facilityOptions = facilities.map((facility) => ({
      label: facility.name,
      value: String(facility.id),
    }));

  return (
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
      {errors.facilities && (
        <p className="text-caution text-sm font-bold">
          {errors.facilities.message}
        </p>
      )}

    </div>
  )
}
