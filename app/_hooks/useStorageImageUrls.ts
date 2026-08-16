import { useEffect, useState } from "react";
import { supabase } from "@/app/_libs/supabase";

type Props = {
  bucket: string;
  imageKeys: string[];
};

export const useStorageImageUrls = ({
  bucket,
  imageKeys
}: Props) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!imageKeys.length) {
      setImageUrls([]);
      return
    }

    const urls = imageKeys.map((imageKey) => {
      const {
        data: { publicUrl },
      } = supabase.storage
        .from(bucket)
        .getPublicUrl(imageKey);

      return publicUrl;
    });

    setImageUrls(urls);
  }, [bucket, imageKeys]);

  return imageUrls;
}
