"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react"
import { useFetch } from "@/app/_hooks/useFetch";
import { type PostsIndexResponse } from "@/app/_types/posts";
import { type SortType } from "@/app/_types/sort";
import { Rating } from "@/app/posts/[id]/_components/Rating";
// import { PostChildSection } from "@/app/posts/[id]/_components/PostChildren";
import { FeatureList } from "@/app/posts/[id]/_components/FeatureList";
import { UserAvatar } from "@/app/posts/[id]/_components/UserAvatar";
import { PostImages } from "@/app/posts/[id]/_components/PostImages";
import { FEATURE_CATEGORY_ID } from "@/app/_constants/featureCategoryId";
import { PrefectureFilterModal } from "@/app/_components/PrefectureFilterModal";
import { SortSelect} from "@/app/_components/SortSelect";

import { usePrefectureFilter } from "@/app/_hooks/usePrefectureFilter";


type LocationCoordinates = {
  lat: number;
  lng: number;
};

export default function Page() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { isFilterOpen, handleOpenFilter, handleCloseFilter, handleApplyFilter } = usePrefectureFilter();
  const [sortOpen, isSortOpen] = useState<SortType>("newest");


  // URLからページ番号を取得
  const pageParam = Number(searchParams.get("page") ?? "1");
  const currentPage = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  // URLからエリアIDを取得
  const prefectureId = searchParams.get("prefectureId");

  // URLから並び替え条件を取得
  const sortParam = searchParams.get("sort");

  const sort: SortType = sortParam === "rating_desc" || sortParam === "distance_asc" ? sortParam : "newest";

  // 現在地の緯度・経度
  const [currentLocation, setCurrentLocation] = useState<LocationCoordinates | null>(null);

  useEffect(() => {
    // 現在地から近い順が選択された場合、位置情報を取得する
    if (sort !== "distance_asc") return;

    // すでに位置情報を取得している場合は再取得しない
    if (currentLocation) return;

    // ブラウザが位置情報取得に対応していない場合
    if (!navigator.geolocation) {
      alert("このブラウザでは位置情報を取得できません。");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        alert("現在地を取得できませんでした。位置情報の利用を許可してください。");

        // 位置情報を取得できなかった場合は新着順に戻す
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", "newest");
        params.set("page", "1");

        // 更新したURLへ遷移
        router.replace(`${pathName}?${params.toString()}`);

      }

    )
  }, [sort, currentLocation, searchParams, router, pathName]);


  // 現在地から近い順を選択していて、位置情報がまだない場合は
  // 位置情報の取得後に距離順のリクエストを送る
  const apiSort: SortType = sort === "distance_asc" && !currentLocation ? "newest" : sort;

  // APIのURLを作成
  const apiParams = new URLSearchParams();

  apiParams.set("page", String(currentPage));
  apiParams.set("sort", apiSort);

  if (prefectureId) {
    apiParams.set("prefectureId", prefectureId);
  }

  // 距離順の場合は現在地の緯度・経度もAPIに渡す
  if (apiSort === "distance_asc" && currentLocation) {
    apiParams.set("lat", String(currentLocation.lat));
    apiParams.set("lng", String(currentLocation.lng));
  }

  const apiUrl = `/api/posts?${apiParams.toString()}`;

  const { data, error, isLoading } = useFetch<PostsIndexResponse>(apiUrl);


  // ページ番号を変更する
  const handlePageChange = (newPage: number) => {
    // 現在のURLパラメータを引き継ぐ
    const params = new URLSearchParams(searchParams.toString());

    // ページ番号だけを更新
    params.set("page", String(newPage));

    // 更新したURLへ遷移
    router.replace(`${pathName}?${params.toString()}`);
  }

  // 並び替え条件を変更する
  const handleSortChange = (newSort: SortType) => {
    // 現在のURLパラメータを引き継ぐ
    const params = new URLSearchParams(searchParams.toString());

    // 並び替え条件を更新
    params.set("page", String(newSort));

    // 並び替えを変更したら1ページ目に戻す
    params.set("page", "1");

    // 更新したURLへ遷移
    router.replace(`${pathName}?${params.toString()}`);

  }



  if (isLoading) return <div><p>読み込み中...</p></div>;

  if ( error ) return <div><p>エラー：{ error instanceof Error ? error.message : "不明なエラー" }</p></div>

  const posts = data?.posts ?? [];

  if ( !posts ) return <div><p>投稿が見つかりませんでした。</p></div>
  // console.log(posts);


  return (
    <div>
      <main>
        <div className="flex items-center justify-center flex-col pt-60 gap-9 w-full max-w-100 mx-auto">
          {!isLoading && (
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={handleOpenFilter}
                className="flex items-center gap-3 posts-bg-primary rounded-full border border-solid posts-border-primary px-6 py-3.5 posts-secondary-text font-medium text-sm shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
              >
                <Image
                  src="/posts/pin.svg"
                  className="mx-auto"
                  width={13}
                  height={16}
                  priority
                  alt=""
                />
                <span className="inline-block leading-none">エリアを選択</span>
              </button>
              <PrefectureFilterModal
                isOpen={isFilterOpen}
                selectedPrefectureId={
                  prefectureId ? Number(prefectureId) : null
                }
                onClose={handleCloseFilter}
                onApply={handleApplyFilter}
              />
              <SortSelect value={sortOpen} onChange={isSortOpen}/>
            </div>
          )}
          {posts.length === 0 ? (
            <p>投稿が見つかりませんでした。</p>
          ) : (
            posts.map(( post ) => (
              <article key={ post.id } className="space-y-8 posts-detail-bg rounded-4xl shadow-[0_8px_30px_0_rgb(0_0_0_/_0.04)]">
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
                        <h3 className="text-sm font-medium posts-secondary-text">{post.shop.name}</h3>
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
                      <div>
                        <p className="posts-section-text font-medium text-sm text-right">
                          投稿日：{new Date(post.createdAt).toLocaleDateString("ja-JP", { year: "numeric", month: "numeric", day: "numeric" })}
                        </p>
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
