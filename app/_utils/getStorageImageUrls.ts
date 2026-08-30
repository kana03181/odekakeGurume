import { supabase } from "@/app/_libs/supabase";

type Props = {
  bucket: string;
  imageKeys: string[];
};

export const useStorageImageUrls = ({
  bucket,
  imageKeys
}: Props) => {

  return imageKeys.map((imageKey) => {
    const {
      data: { publicUrl },
    } = supabase.storage
      .from(bucket)
      .getPublicUrl(imageKey);

    return publicUrl;
  });

}
