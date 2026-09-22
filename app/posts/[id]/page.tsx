"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { postShowResponse } from "@/app/api/posts/[id]/route";
import { supabase } from "@/app/_libs/supabase";
import { useFetch } from "@/app/_hooks/useFetch";
import Image from "next/image";
import { Rating } from "@/app/posts/[id]/_components/Rating";
import { PostChildSection } from "@/app/posts/[id]/_components/PostChildren";
import { FeatureList } from "@/app/posts/[id]/_components/FeatureList";
import { FEATURE_CATEGORY_ID } from "@/app/_constants/featureCategoryId";



export default function detailPostPage() {
  const { id } = useParams<{ id: string }>();
  const [thimbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null);

  const { data, error, isLoading } = useFetch<postShowResponse>(`/api/posts/${id}`)

  const post = data?.post;
  console.log(post);


  if (isLoading) return <div><p>読み込み中...</p></div>

  if (error) return <div><p>エラー：{error instanceof Error ? error.message : "不明なエラー"}</p></div>

  if (!post) return <div><p>投稿が見つかりません。</p></div>


  return (
    <div className="flex items-center justify-center flex-col pt-60">
      <article className="space-y-8 w-full max-w-100 posts-detail-bg rounded-4xl shadow-[0_8px_30px_0_rgb(0_0_0_/_0.04)]">
        <div className="p-6">
          <div className="mb-4">
            <div className="postUserIcon">
              <img src="" alt="" />
            </div>
            <div className="postUserName">
              <p className="font-base font-bold">{post.user.userName}</p>
              {/* <div>
                <img src={post.user.thumbnailUrl} alt="" /></div> */}
            </div>
          </div>
          <div className="grid gap-8">
            <h3 className="text-3xl font-medium">{post.shop.name}</h3>
            <div className="postVote flex items-center justify-end flex-row-reverse gap-4 posts-detail-section-bg p-5 rounded-3xl">
              <div className="grid">
                <p className="text-base font-medium posts-recommend-text">オススメ度</p>
                <div className="star">
                  <Rating rating={post.rating} />
                </div>
              </div>
              <div className="w-fit bg-accent-primary p-3.5 rounded-full">
                <Image
                  width={20}
                  height={20}
                  loading='lazy'
                  src={post.childFriendlyVote ? "/posts/recommend.svg" : "/posts/bad.svg"}
                  alt=""
                />
              </div>
            </div>
            <div className="postChildren">
              <p className="posts-section-text font-medium text-base mb-4">子供の人数・年齢層</p>
              <div className="grid gap-3">
                <PostChildSection
                  postChildren={post.postChildren}
                />
              </div>

            </div>
            <div className="postMeal">
              <p className="posts-section-text font-medium text-base mb-4">お食事</p>
              <div className="grid grid-cols-2 gap-3">
                <FeatureList
                  features={post.postFeatures}
                  categoryId={FEATURE_CATEGORY_ID.MEAL}
                />
              </div>
            </div>
            <div className="postFacility">
              <p className="posts-section-text font-medium text-base mb-4">設備</p>
              <div className="grid  grid-cols-2 gap-3">
                <FeatureList
                  features={post.postFeatures}
                  categoryId={FEATURE_CATEGORY_ID.FACILITY}
                />
              </div>
            </div>

            <div className="postImages">
              {post.postImages.map((image) => (
                <img key={image.imageUrl} src="{image.imageUrl}" alt="" />
              ))}
            </div>
            <div className="postComment">
              <p className="posts-section-text font-medium text-base mb-4">コメント</p>
              <p className="posts-bg-primary p-6 rounded-2xl text-primary text-sm font-medium min-h-28">{ post.comment }</p>
            </div>
            <div className="postTime">
              <p className="posts-section-text font-medium text-sm text-right">来店日：{ new Date(post.visitedDate).toLocaleDateString("ja-JP", { year: "numeric", month: "numeric", day: "numeric" })}</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  )

}
