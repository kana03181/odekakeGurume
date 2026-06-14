"use client";

import useSWR from "swr";

export const usePublicFetch = <T>(url:string) => {
  const fetcher = async (url: string): Promise<T> => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("データ取得に失敗しました");
    }
    return res.json();
  };

  const { data, error, isLoading } = useSWR<T>(url, fetcher);
  return { data, error, isLoading };
}
