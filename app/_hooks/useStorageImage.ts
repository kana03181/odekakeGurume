import { useEffect, useState } from "react";
import { supabase } from "@/app/_libs/supabase";

type Props = {
  bucket: string;
  imageKey?: string | null;
};

export const useStorageImage = ({
  bucket,
  imageKey
}: Props) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageKey) {
      setImageUrl(null);
      return
    }

    const { data: { publicUrl },
    } = supabase.storage
      .from(bucket)
      .getPublicUrl(imageKey);

    setImageUrl(publicUrl);

  }, [bucket, imageKey])

  return imageUrl;
}
