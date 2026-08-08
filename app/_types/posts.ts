export type CreatePostRequestBody = {
  shopId: number;
  visitedDate: Date;

  postImages: {
    imageUrl: string;
  }[];

  postFeatures: {
    featureId: number;
  }[];

  postChildren: {
    ageGroup: string;
  }[];

  rating: number;
  comment: string;
  childFriendlyVote: boolean;
};

export type CreatePostResponse = {
  id: number;
};
