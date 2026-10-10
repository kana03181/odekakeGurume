import { useSignedUrl } from "@/app/_hooks/useSignedUrl";

type UserAvatarProps = {
  thumbnailUrl: string | null;
  userName: string | null;
};

export function UserAvatar( {thumbnailUrl, userName}: UserAvatarProps ) {
  // フックを呼び出し、パスから「単一の署名付きURL（signedUrl）」と「ローディング状態」を取得
  const { signedUrl, loading } = useSignedUrl("profile_thumbnail", thumbnailUrl);

  if (loading) {
    // 読み込み中はスケルトンを表示
    return <div className="w-40 h-40 rounded-full bg-gray-200 animate-pulse" />
  }

  if (!signedUrl) {
    // URLが取れなかった（画像がない）場合のフォールバック
    return <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center text-xs">No Img</div>;
  }

  return (
    //取得した有効な署名付きURLをimageタグに渡して表示
    <img
      src={signedUrl}
      alt={userName ? `${userName}のプロフィール画像` : "プロフィール画像"}
      width={40}
      height={40}
      className="rounded-full object-cover aspect-square"
    />
  )
}
