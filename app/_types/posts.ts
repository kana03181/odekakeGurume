
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

//投稿一覧APIのレスポンスの型（posts というキーの中に、口コミデータが複数件入る）
export type PostsIndexResponse = {
  posts: {
    id: number,
    visitedDate: Date;
    shop: {
      id: number;
      prefectureId: number;
      name: string;
      address: string;
    }

    rating: number;
    childFriendlyVote: boolean;
    comment: string;
    createdAt: Date;

    user: {
      userName: string | null;
      thumbnailUrl: string | null;
    };

    postChildren: {
      ageGroup: string;
    }[];

    postImages: {
      imageUrl: string;
    }[];

    postFeatures: {
      featureId: number;
      feature: {
        name: string;
        categoryId: number;
        category: {
          label: string
        }
      }
    }[];
  }[];
};
