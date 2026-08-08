
import { AgeGroup } from "@/app/generated/prisma/client"
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect} from "react";
import { usePublicFetch } from "@/app/_hooks/usePublicFetch";
import { GetFeatureResponse } from "@/app/api/features/route";
import { AGE_GROUP_OPTIONS, AGE_GROUP_LABEL } from "@/app/_constants/ageGroupOptions";
import { type PostsForm } from "@/app/_libs/schemas/posts.schema";
import { Button } from "@/app/_components/Button";


export const AgeGroupSection = () => {
  const {
    reset,
    control,
    setValue,
    formState: {
      errors,
    }
  } = useFormContext<PostsForm>();

    // 子供人数
  const children = useWatch({
    control,
    name:"children"
  })


  //年齢層をAPIから取得
  // const { data: ageGroups, error: ageGroupsError } = usePublicFetch<GetFeatureResponse>("/api/features?category=年齢層")

  // const ageGroups = [
  //   {
  //     value: AgeGroup.ZERO_TO_TWO,
  //     label: "0-2歳",
  //   },
  //   {
  //     value: AgeGroup.THREE_TO_FIVE,
  //     label: "3-5歳",
  //   },
  //   {
  //     value: AgeGroup.OVER_SIX,
  //     label: "6歳～",
  //   },

  // ]

  // console.log(AgeGroup);


  //ageGroups を元にchildren を自動生成
  useEffect(() => {
    if (!AGE_GROUP_OPTIONS) return

    // console.log(AGE_GROUP_OPTIONS);


    reset((prev) => ({
      ...prev,
      children: AGE_GROUP_OPTIONS.map((group) => ({
        ageGroup: group.value,
        count: 0,
      }))
    }));

  }, [AGE_GROUP_OPTIONS, reset]);

  // if (ageGroupsError) {
  //   return <p>読み込みに失敗しました</p>
  // }

    if (!AGE_GROUP_OPTIONS) {
    return <p>読み込み中</p>
  }

  //id → labelの辞書化
  // const ageGroupLabel = Object.fromEntries(ageGroups.map((group) => [
  //   String(group.id),
  //   group.name,
  // ]));
  // console.log(ageGroupLabel);

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
      { children.map((child, index) =>(
        <div className="flex gap-2 justify-between" key={child.ageGroup}>
          <p className="pt-1">{ AGE_GROUP_LABEL[child.ageGroup] }</p>
          <div className="flex items-center">
            <Button type="button" onClick={() => handleDecrease(index)} className="w-8 h-8 rounded-full p-0 text-2xl posts-countBtn"> - </Button>
            <span className="px-4">{ child.count }</span>
            <Button type="button" onClick={() => handleIncrease(index)} className="w-8 h-8 rounded-full p-0 text-2xl posts-countBtn"> + </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
