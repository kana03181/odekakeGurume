import { useFormContext } from "react-hook-form";
import { usePublicFetch } from "@/app/_hooks/usePublicFetch";
import { GetFeatureResponse } from "@/app/api/features/route";
import { type PostsForm } from "@/app/_libs/schemas/posts.schema";
import { RadioBtnInput } from "@/app/_components/RadioBtnInput";
import Label from "@/app/_components/Label";


export const UsageSceneSection = () => {
  const {
    register,
    formState:{ errors },
  } = useFormContext<PostsForm>();

  //利用シーンをAPIから取得
  const { data: usageScenes, error: usageScenesError } = usePublicFetch<GetFeatureResponse>("/api/features?category=利用シーン")

  if (usageScenesError) {
    return <p>読み込みに失敗しました</p>
  }

  if (!usageScenes) {
    return <p>読み込み中</p>
  }

  //option変換
  const usageSceneOptions = usageScenes.map((scene) => ({
    label: scene.name,
    value: String(scene.id),
  }));

  return (
    <div className='posts-bg-primary rounded-[calc(32/16*1rem)] p-6 space-y-4'>
      <h3 className='text-2xl font-medium'>利用シーン</h3>
      <div className="flex gap-2 flex-wrap">
        {usageSceneOptions.map((usageScene) => (
          <Label className="text-sm font-medium text-primary input-bg-secondary rounded-full hover:bg-[#A3EED8] hover:text-[rgb(31,110,93)] cursor-pointer" key={usageScene.value}>
            <RadioBtnInput
              value={usageScene.value}
              {...register("usageScenes")}
              className='peer sr-only rounded-full input-bg-secondary'
            />
            <span className="inline-block text-sm font-medium text-primary px-5 py-2.5 w-full rounded-full input-bg-secondary hover:bg-[#A3EED8] transition-colors peer-checked:bg-[#A3EED8] peer-checked:text-[#1F6E5D]">
              {usageScene.label}
            </span>
          </Label>
        ))}
      </div>
      {errors.usageScenes && (
        <p className="text-caution text-sm font-bold">
          {errors.usageScenes.message}
        </p>
      )}
    </div>
  )
}
