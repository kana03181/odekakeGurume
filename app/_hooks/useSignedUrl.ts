"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/app/_libs/supabase";


/**
 * 複数の画像パス（配列）から署名付きURLを一括取得するコアフック
 */
export function useSignedUrls(
  bucket: string, // 対象のSupabaseバケット名
  paths: (string | null | undefined)[], // 取得したい画像のパスの配列
  expiresIn: number = 3600 // URLの有効期限（秒）。デフォルト1時間
) {
  // 取得した署名付きURLの配列を保持するstate（初期値は空配列）
  const [signedUrls, setSignedUrls] = useState<(string | null)[]>([]);
  // ローディング中かどうかを保持するstate（初期値はtrue）
  const [loading, setLoading] = useState<boolean>(true);

  // 配列の中身が変わったかを正しく検知するため、JSON文字列に変換してキーにする
  const pathKey = JSON.stringify(paths);

  useEffect(() => {
    let isMounted = true; // コンポーネントが画面に存在しているか（アンマウント対策）のフラグ

    async function fetchSignedUrls() {
      // nullやundefinedを除外して、有効なパスだけの配列を作る
      const validPaths = paths.filter( (p): p is string => Boolean(p) );

      // 有効なパスが1つもない場合は、すべてnullにしてローディングを終了
      if ( validPaths.length === 0 ) {
        setSignedUrls( paths.map( () => null ) );
        setLoading(false);
        return;
      }

      setLoading(true); // 取得開始なのでローディングをtrueにする

      // Supabase Storageから、複数のパスに対して一括で署名付きURLを生成
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrls(validPaths, expiresIn);

      // 非同期処理が終わった時点で、まだコンポーネントが画面にいる場合のみ処理を進める
      if ( isMounted ) {
        if (data) {
          // 取得したURLデータ（パス）をキーにしたMapに変換
          const urlMap = new Map( data.map( (item) => [item.path, item.signedUrl]) );
          // 元のパスの順番通りにURLを並べ替え。なければnullを格納
          const result = paths.map( (p) => ( p ? urlMap.get(p) ?? null : null) );

          setSignedUrls(result); // StateにURLの配列をセット

        } else {
          // エラー時はログを出し、すべてnullをセット
          console.error( `[${bucket}] 署名付きURL取得エラー：`, error?.message );
          setSignedUrls( paths.map(() => null) );
        }
        setLoading(false); // 通信完了。ローディングをfalse
      }
    }
    fetchSignedUrls(); // 非同期関数を実行

    // クリーンアップ関数: コンポーネントが消えた後にsetStateが走るのを防ぐ
    return () => {
      isMounted = false;
    };
  }, [bucket, pathKey, expiresIn]); // 依存配列：これらの値が変わったときだけ再取得が走る

  return { signedUrls, loading }; // 呼び出し元へURL配列とローディング状態を返す
}

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
