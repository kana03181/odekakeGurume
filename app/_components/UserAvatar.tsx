import { useSignedUrl } from "@/app/_hooks/useSignedUrl";
import Image from "next/image";


type UserAvatarProps = {
  thumbnailUrl: string | null;
  userName: string | null;
  width?: number;
  height?: number;
};

export function UserAvatar( {
  thumbnailUrl,
  userName,
  width = 40,
  height = 40,
}: UserAvatarProps ) {
  // フックを呼び出し、パスから「単一の署名付きURL（signedUrl）」と「ローディング状態」を取得
  const { signedUrl, loading } = useSignedUrl(
    "profile_thumbnail",
    thumbnailUrl
  );


  return (
    //取得した有効な署名付きURLをimageタグに渡して表示
    <Image
      src={ loading || !signedUrl ? "/profile/default_avatar.svg" : signedUrl }
      alt={userName ? `${userName}のプロフィール画像` : "プロフィール画像"}
      width={width}
      height={height}
      className="rounded-full object-cover aspect-square"
    />
  )
}
