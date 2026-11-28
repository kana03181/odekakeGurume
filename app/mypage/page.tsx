'use client'

import { useRouter } from "next/navigation";
import { GetProfileResponse } from "@/app/api/profile/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useFetch } from "@/app/_hooks/useFetch";
import { type MyPagePostsResponse } from "@/app/_types/mypage";
import { PostImages } from "@/app/posts/[id]/_components/PostImages";
import { UserAvatar } from "@/app/_components/UserAvatar";
import Link from "next/link";
import mypageStyles from "./mypage.module.css";


type profileValues = {
  userName: string | null
  thumbnailUrl: string | null
}

export default function Page() {
    const { token, isLoading: isSessionLoading } = useSupabaseSession()
  // const router = useRouter()

  //プロフィールを取得
  const { data, error:getProfileError, isLoading:isUserLoading } = useFetch<GetProfileResponse>("/api/profile")

  const profileData: profileValues = {
    userName: data?.userName ?? null,
    thumbnailUrl: data?.thumbnailUrl ?? null
  }

///投稿を取得
  const { data: postsData, error:getPostsError , isLoading: isPostsLoading } = useFetch<MyPagePostsResponse>("/api/mypage");

  if (getProfileError) {
    return (
      <div>
        <p>
          エラー：{getProfileError instanceof Error
            ? getProfileError.message
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

  const posts = postsData?.posts ?? [];

  if ( !posts ) return <div><p>投稿が見つかりませんでした。</p></div>

  return(
    <div className='flex items-center justify-center flex-col pt-60 space-y-10'>
      <div className='w-full max-w-100 grid place-items-center gap-3'>
        <div className='w-fit rounded-full overflow-hidden bg-profileThumbnail'>
          <UserAvatar
            thumbnailUrl={profileData.thumbnailUrl}
            userName={profileData.userName}
            width={96}
            height={96}
          />
        </div>
        <div className='text-center text-3xl font-bold'>
          <p>{profileData.userName}</p>
        </div>
      </div>
      <div className="grid gap-6">
        <div className="flex align-middle justify-between">
          <h3 className='text-3xl font-bold'>投稿一覧</h3>
          <p className={`text-sm font-semibold px-3 py-2 ${mypageStyles.postsTotal}  ${mypageStyles.postsTotalBg} rounded-full`}>
            {postsData?.totalCount ?? 0}件
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {posts.length === 0 ? (
            <p>まだ投稿がありません</p>
          ) : (
            posts.map((post) => {
              return (
                <article
                  key={post.id}
                  className="w-full space-y-8 posts-detail-bg rounded-4xl shadow-[0_8px_30px_0_rgb(0_0_0_/_0.04)]"
                >
                  <Link href={ `/posts/${post.id}` }>
                    <div>
                      {post.postImages?.length > 0 && (
                        <div>
                          <PostImages
                            images={post.postImages.slice(0, 1)}
                            itemClassName="w-full"
                            imageClassName="rounded-[32px_32px_0_0] aspect-auto"
                            width={163}
                            height={128}
                          />
                        </div>
                      )}
                      <div className="p-3">
                        <h3 className={`text-sm font-medium ${mypageStyles.ShopName}`}>{post.shop.name}</h3>
                        <p className={`font-medium text-xs text-left ${mypageStyles.postDate}`}>
                          投稿日：{new Date(post.createdAt).toLocaleDateString("ja-JP", { year: "numeric", month: "numeric", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                  </Link>
                </article>
              )
            })
          )}
        </div>
      </div>
    </div>
  )

}
