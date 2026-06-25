import { useFormContext, useWatch } from "react-hook-form";
import { usePublicFetch } from "@/app/_hooks/usePublicFetch";
import { GetFeatureResponse } from "@/app/api/features/route";
import { type PostsForm } from "@/app/_libs/schemas/posts.schema";
import { CheckboxInput } from "@/app/_components/CheckboxInput";
import Label from "@/app/_components/Label";

export const MealSection = () => {
  const {
    register,
    formState: {
      errors,
    }
  } = useFormContext<PostsForm>();

    //利用シーンをAPIから取得
    const { data: meals, error: mealsError} = usePublicFetch<GetFeatureResponse>("/api/features?category=お食事")

    if (mealsError) {
      return <p>読み込みに失敗しました</p>
    }

    if (!meals) {
      return <p>読み込み中</p>
    }

    //option変換
    const mealOptions = meals.map((meal) => ({
      label: meal.name,
      value: String(meal.id),
    }));

  return (
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
      {errors.meals && (
        <p className="text-caution text-sm font-bold">
          {errors.meals.message}
        </p>
      )}
    </div>
  )
}
