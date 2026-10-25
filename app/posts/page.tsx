"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useFetch } from "@/app/_hooks/useFetch";
import { type PostsIndexResponse } from "@/app/_types/posts";
import { Rating } from "@/app/posts/[id]/_components/Rating";
// import { PostChildSection } from "@/app/posts/[id]/_components/PostChildren";
import { FeatureList } from "@/app/posts/[id]/_components/FeatureList";
import { UserAvatar } from "@/app/posts/[id]/_components/UserAvatar";
import { PostImages } from "@/app/posts/[id]/_components/PostImages";
import { FEATURE_CATEGORY_ID } from "@/app/_constants/featureCategoryId";
import { PrefectureFilterModal } from "@/app/_components/PrefectureFilterModal";
import { usePrefectureFilter } from "@/app/_hooks/usePrefectureFilter";


export default function Page() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { isFilterOpen, handleOpenFilter, handleCloseFilter, handleApplyFilter } = usePrefectureFilter();

  const pageParam = Number(searchParams.get("page") ?? "1"); // URLからページ番号を取得
  const currentPage = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const prefectureId = searchParams.get("prefectureId");



  const apiUrl = prefectureId
    ? `/api/posts?page=${currentPage}&prefectureId=${prefectureId}`
    : `/api/posts?page=${currentPage}`;

  const { data, error, isLoading } = useFetch<PostsIndexResponse>(apiUrl);

  const handlePageChange = (newPage: number) => {
    // 現在のURLパラメータを引き継ぐ
    const params = new URLSearchParams(searchParams.toString());

    // ページ番号だけを更新
    params.set("page", String(newPage));

    // 更新したURLへ遷移
    router.replace(`${pathName}?${params.toString()}`);
  }



  if (isLoading) return <div><p>読み込み中...</p></div>;

  if ( error ) return <div><p>エラー：{ error instanceof Error ? error.message : "不明なエラー" }</p></div>

  const posts = data?.posts ?? [];

  if ( !posts ) return <div><p>投稿が見つかりませんでした。</p></div>
  console.log(posts);


  return (
    <div>
      <main>
        <div className="flex items-center justify-center flex-col pt-60 gap-12">
          <div>
            <button
              type="button"
              onClick={handleOpenFilter}
              className="rounded-full border px-6 py-3"
            >
              エリアを選択
            </button>
            <PrefectureFilterModal
              isOpen={isFilterOpen}
              selectedPrefectureId={
              prefectureId ? Number(prefectureId) : null
              }
              onClose={handleCloseFilter}
              onApply={handleApplyFilter}
            />
          </div>
          {posts.length === 0 ? (
            <p>投稿が見つかりませんでした。</p>
          ) : (
            posts.map(( post ) => (
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
            ))
          )}
        </div>
        { data && data.totalPages > 0 && (
          <div className="flex items-center justify-center gap-4 py-8">
            <button
              type="button"
              onClick={() => handlePageChange((currentPage) - 1)}
              disabled={currentPage === 1}
              className="disabled:opacity-40"
            >
              前へ
            </button>

            <span>
              {currentPage} / {data.totalPages}
            </span>

            <button
              type="button"
              onClick={() => handlePageChange((currentPage) + 1)}
              disabled={currentPage >= data.totalPages}
              className="disabled:opacity-40"
            >
              次へ

            </button>
          </div>
        )}
      </main>
    </div>
  )
}
