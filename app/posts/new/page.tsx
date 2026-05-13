"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreatePostRequestBody } from "@/app/api/posts/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSettion";
import { Rating } from "@/app/generated/prisma/client"
import { AgeGroup } from "@/app/generated/prisma/client"



type PostData = {
  shopId: number
  visitedDate: Date
  postImages: {
    imageUrl: string
  }[]
  postFeatures: {
    featureId: number
  }[]
  postChildren: {
    ageGroup: AgeGroup
  }[]
  rating: Rating
  comment: string
  childFriendlyVote: boolean
}

export default function Page() {
  const { token } = useSupabaseSession();
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {

      const res = await fetch('/api/posts', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          // Authorization: token,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shopId: 1,
          visitedDate: new Date(),
          postImages: [],
          postFeatures: [],
          postChildren: [],
          rating: "TWO",
          comment: "test",
          childFriendlyVote: true,
        }),
      })
      console.log(res)

      if (!res.ok) {
        console.log(await res.text())
        return
      }
      const data = await res.json();
      console.log(data)

      // setPosts([...posts])
    }


    console.log(token);


    fetcher()
  }, [token])

  return (
    <div><p>新規口コミ投稿</p></div>
  )
}
