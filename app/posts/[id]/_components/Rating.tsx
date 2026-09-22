import { RATING_VALUE } from "@/app/_constants/rating";
import { Star } from "lucide-react";

type RatingProps = {
  rating: string;
};

const MAX_RATING = 3;

export const Rating = ({ rating }: RatingProps) => {
  const ratingValue = RATING_VALUE[rating];

  // DBに存在しない評価値だった場合は表示しない
  if (!ratingValue) return null;

  return (
    <div className="flex">
      {Array.from({ length: MAX_RATING }).map((_, index) => {
        const isFilled = index < ratingValue;

        return (
          <Star
            key={index}
            size={20}
            className={isFilled ? "posts-star-fill-active posts-star-text" : "posts-star-fill posts-star-text" }
            fill={isFilled ? "currentColor" : "none"}
          />
        );
        })}
    </div>
  )

}
