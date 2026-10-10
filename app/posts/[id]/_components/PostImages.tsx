import { useSignedUrls } from "@/app/_hooks/useSignedUrl";

type PostImagesProps = {
  images: { imageUrl: string }[];
}


export function PostImages( {images}: PostImagesProps ) {
  // 投稿画像のオブジェクト配列から「画像パスの文字列だけの配列」に変換する
  const imagePaths = images.map( (img) => img.imageUrl );

  // 複数用フックを呼び出し、パスの配列から「署名付きURLの配列（signedUrls）」を一括取得
  const { signedUrls, loading } = useSignedUrls( "posts_image", imagePaths );

  if ( loading ) {
    return <div className="text-sm text-gray-400">画像読み込み中…</div>;
  }

  if (signedUrls.length === 0) return null;

  // 取得したURLの配列をmapで展開し、1枚ずつ画像として描画
  return (
    <div className="grid grid-cols-2 gap-2 my-3">
      {signedUrls.map((url, index) =>
        url ? (
          <img
            key={index}
            src={url}
            alt={`投稿画像 ${index + 1}`}
            width={300}
            height={200}
            className="rounded-lg object-cover w-full h-48"
          />
        ): null
      )}
    </div>
  )
}
