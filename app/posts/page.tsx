"use client";

import Link from "next/link";
import { useFetch } from "@/app/_hooks/useFetch";
import { type PostsIndexResponse } from "@/app/_types/posts";
import Image from "next/image";
import { Rating } from "@/app/posts/[id]/_components/Rating";
import { PostChildSection } from "@/app/posts/[id]/_components/PostChildren";
import { FeatureList } from "@/app/posts/[id]/_components/FeatureList";
import { UserAvatar } from "@/app/posts/[id]/_components/UserAvatar";
import { PostImages } from "@/app/posts/[id]/_components/PostImages";
import { FEATURE_CATEGORY_ID } from "@/app/_constants/featureCategoryId";



export default function Page() {

  const { data, error, isLoading } = useFetch<PostsIndexResponse>("/api/posts");

  if ( isLoading ) return <div><p>読み込み中...</p></div>;

  if ( error ) return <div><p>エラー：{ error instanceof Error ? error.message : "不明なエラー" }</p></div>

  const posts = data?.posts ?? [];

  return (
    <div>
      <main>
        <div className="flex items-center justify-center flex-col pt-60 gap-12">
          {posts.map(( post ) =>
            <article key={ post.id } className="space-y-8 w-full max-w-100 posts-detail-bg rounded-4xl shadow-[0_8px_30px_0_rgb(0_0_0_/_0.04)]">
              <Link href={ `/posts/${post.id}` }>
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="postUserIcon">
                      <UserAvatar
                        thumbnailUrl={post.user.thumbnailUrl}
                        userName={post.user.userName}
                      />
                    </div>
                    <div>
                      <div className="flex gap-2">
                        <div className="postUserName">
                          <p className="text-base font-bold">{post.user.userName}</p>
                        </div>
                        <div className="star">
                          <Rating rating={post.rating} />
                        </div>
                      </div>
                      <h3 className="text-sm font-medium posts-shopName-text">{post.shop.name}</h3>
                    </div>
                  </div>
                  <div className="grid gap-8">
                    <div className="postImages">
                      <PostImages images={post.postImages}/>
                    </div>
                    <div className="postComment">
                      <p className="posts-bg-primary p-6 rounded-2xl text-primary text-sm font-medium min-h-28">{ post.comment }</p>
                    </div>
                    <div className="postMeal">
                      <div className="grid grid-cols-2 gap-3">
                        <FeatureList
                          features={post.postFeatures}
                          categoryId={FEATURE_CATEGORY_ID.MEAL}
                        />
                      </div>
                    </div>
                    <div className="postFacility">
                      <div className="grid  grid-cols-2 gap-3">
                        <FeatureList
                          features={post.postFeatures}
                          categoryId={FEATURE_CATEGORY_ID.FACILITY}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </Link>
            </article>

          )}
        </div>
      </main>
    </div>
  )
}
