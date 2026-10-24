"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

export const usePrefectureFilter = () => {

  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false); //モーダルを表示するかどうか

  //モーダルを開く
  const handleOpenFilter = () => {
    setIsFilterOpen(true);
  }

  //モーダルを閉じる
  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  }

  // 都道府県の選択結果をURLに反映
  const handleApplyFilter = (prefectureId: number | null) => {
    const params = new URLSearchParams(searchParams.toString());

    // 絞り込み条件が変わるため、1ページ目に戻す
    params.set("page", "1");

    if (prefectureId !== null) {
      params.set("prefectureId", String(prefectureId));
    } else {
      params.delete("prefectureId");
    }

    router.push(`${pathName}?${params.toString()}`);

    // 適用後にモーダルを閉じる
    setIsFilterOpen(false);
  };

  return {
    isFilterOpen,
    handleOpenFilter,
    handleCloseFilter,
    handleApplyFilter
  };


};
