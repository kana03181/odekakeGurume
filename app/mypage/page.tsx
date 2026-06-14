'use client'

import { useRouter } from "next/navigation";
import { GetProfileResponse } from "@/app/api/profile/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useFetch } from "@/app/_hooks/useFetch";
import { useStorageImage } from "@/app/_hooks/useStorageImage";
import Image from "next/image";

type profileValues = {
  userName: string | null
  thumbnailUrl: string | null
}

export default function Page() {
    const { token, isLoading: isSessionLoading } = useSupabaseSession()
  // const router = useRouter()

    //プロフィールを取得
  const { data, error, isLoading:isUserLoading } = useFetch<GetProfileResponse>("/api/profile")

  const profileData: profileValues = {
    userName: data?.userName ?? null,
    thumbnailUrl: data?.thumbnailUrl ?? null
  }

  const profileThumbnailUrl = useStorageImage({
    bucket: "profile_thumbnail",
    imageKey: profileData.thumbnailUrl
  });

  if (error) {
    return (
      <div>
        <p>
          エラー：{error instanceof Error
            ? error.message
            : "プロフィールの取得に失敗しました"}
        </p>
      </div>
    )
  }

  if ( isSessionLoading || isUserLoading || !data) {
    return (
      <div className='grid place-content-center'>
        <p className='text-sm'>読み込み中...</p>
      </div>
    )
  }


  return(
    <div className='flex items-center justify-center flex-col pt-60 space-y-10'>
      <div className='w-full max-w-100 grid place-items-center gap-3'>
        <div className='w-fit rounded-full overflow-hidden bg-profileThumbnail'>
          <Image
            src={profileThumbnailUrl || "/profile/default_avatar.svg"}
            alt="プロフィール画像"
            width={96}
            height={96}
            loading='eager'
            className='aspect-square object-cover'
          />
        </div>
        <div className='text-center text-3xl font-bold'>
          <p>{profileData.userName}</p>
        </div>
      </div>
      <div className='text-left text-3xl font-bold'>
        <p>投稿一覧</p>
      </div>
    </div>
  )

}
