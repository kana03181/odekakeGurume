import { v4 as uuidv4 } from 'uuid'
import { supabase } from "@/app/_libs/supabase";

type uploadImageProps = {
  file: File
  bucket: string
  folder?: string
}

export const uploadImage = async ({
  file,
  bucket,
  folder="private",
}: uploadImageProps) => {

    // ファイルパスを指定
    const filePath = `${folder}/${uuidv4()}`

  // Supabaseに画像をアップロード
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    throw new Error(error.message);
  }

  return data.path;

}
