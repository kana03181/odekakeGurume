
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { usePublicFetch } from "@/app/_hooks/usePublicFetch";
import { type AgeGroupOptions } from "@/app/_types/ageGroup";
import { type PostsForm } from "@/app/_libs/schemas/posts.schema";
import { Button } from "@/app/_components/Button";


export const AgeGroupSection = () => {
  const {
    reset,
    control,
    setValue,
  } = useFormContext<PostsForm>();


  //年齢グループをAPIから取得
  const { data: ageGroupOptions } = usePublicFetch<AgeGroupOptions[]>("/api/ageGroups");


  //APIから取得した年齢グループをchildrenに設定
  useEffect(() => {
    if (!ageGroupOptions) return;

    reset((prev) => ({
      ...prev,
      children: ageGroupOptions.map((option) => ({
        ageGroup: option.value,
        count: 0,
      })),
    }));
  }, [ageGroupOptions, reset])

  // React Hook Formのchildrenを監視
  const children = useWatch({
    control,
    name:"children"
  })


    // 人数 +
  const handleIncrease = (index: number) => {
    const currentCount = children[index].count;

    setValue(
      `children.${index}.count`,
      currentCount + 1
    );
  };

  // 人数 -
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

  return (
    <div className='posts-bg-primary rounded-[calc(32/16*1rem)] p-6 space-y-4'>
      <h3 className='text-2xl font-medium'>同伴した子供の詳細</h3>
      <div className="flex gap-2 justify-between">
        <p className="max-w-[147px]">年齢</p>
        <p className="max-w-[147px]">人数</p>
      </div>
      {children.map((child, index) => {
        const ageGroupOption = ageGroupOptions?.find((option) => option.value === child.ageGroup);

        return (
          <div className="flex gap-2 justify-between" key={child.ageGroup}>
            <p className="pt-1">{ ageGroupOption?.label }</p>
            <div className="flex items-center">
              <Button type="button" onClick={() => handleDecrease(index)} className="w-8 h-8 rounded-full p-0 text-2xl posts-countBtn"> - </Button>
              <span className="px-4">{ child.count }</span>
              <Button type="button" onClick={() => handleIncrease(index)} className="w-8 h-8 rounded-full p-0 text-2xl posts-countBtn"> + </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
