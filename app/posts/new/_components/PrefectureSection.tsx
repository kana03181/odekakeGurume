
import { useFormContext } from "react-hook-form";
import { usePublicFetch } from "@/app/_hooks/usePublicFetch";
import { GetPrefectureResponse } from "@/app/api/prefectures/route";
import { type PostsForm } from "@/app/_libs/schemas/posts.schema";
import Label from "@/app/_components/Label";
import { PrefectureSelect } from "@/app/_components/PrefectureSelect";

export const PrefectureSection = () => {
  const {
    register,
    formState:{ errors },
  } = useFormContext<PostsForm>();

  //都道府県をAPIから取得
  const { data: prefectures, error: prefectureError } = usePublicFetch<GetPrefectureResponse>("/api/prefectures")
  // console.log(prefectures);

  if (prefectureError) {
    return <p>読み込みに失敗しました</p>
  }

  if (!prefectures) {
    return <p>読み込み中</p>
  }

  const prefectureOptions = prefectures.map((prefecture) => ({
      label: prefecture.name,
      value: String(prefecture.id),
    })
  );

  return (
    <div className='space-y-2'>
      <Label htmlFor='prefecture'>
          都道府県
      </Label>
      <PrefectureSelect
        {...register("prefecture")}
        id='prefecture'
        className='input-bg-primary placeholder-[#B4A89F] block w-full p-2.5'
        options={prefectureOptions}
        />
      {errors.prefecture && (
        <p className="text-caution text-sm font-bold">
          {errors.prefecture.message}
        </p>
      )}
    </div>
  )
}
