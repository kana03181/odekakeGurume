"use client"

import { useSignedUrls } from "@/app/_hooks/useSignedUrls";


/**
 * 単一の画像パスから署名付きURLを取得するフック
 */
export function useSignedUrl(
  bucket: string,
  path: string | null | undefined,
  expiresIn: number = 3600
) {
  // 単一のパスを [path] と配列包みにし、上記の複数用フックに処理を丸投げ
  const { signedUrls, loading } = useSignedUrls(bucket, [path], expiresIn);

  // 返ってきた配列の先頭（0番目）の要素だけを取り出して単一用として返す
  return { signedUrl: signedUrls[0] ?? null, loading };
}
