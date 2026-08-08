import { z } from "zod";
import { AgeGroup } from "@/app/generated/prisma/client";

export const createPostRequestSchema = z.object({

  shopId: z.number(),

  visitedDate: z.coerce.date(),

  postImages: z.array(
    z.object({
      imageUrl: z.string(),
    })
  ),

  postFeatures: z.array(
    z.object({
      featureId: z.number(),
    })
  ),

  postChildren: z.array(
    z.object({
      ageGroup: z.enum(AgeGroup),
  }),
),

  rating: z.number(),
  comment: z.string(),
  childFriendlyVote: z.boolean(),


});
