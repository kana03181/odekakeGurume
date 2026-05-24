"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR from "swr";

export const useFetch = <T>( url: string ) => {
  const { token } = useSupabaseSession();

  const fetcher = async ( [url, token] : [string, string] ):Promise<T> => {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      }
    });

    if (res.status === 401) {
      throw new Error("ユーザー情報が見つかりませんでした");
    }

    if (!res.ok) {
      throw new Error("データ取得に失敗しました");
    }

    return res.json();
  }

  const { data, error, isLoading } = useSWR<T>(
    token ? [url, token] : null,
    fetcher
  )

  return{ data, error, isLoading }
}
