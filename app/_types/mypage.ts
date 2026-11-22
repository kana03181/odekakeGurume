
export type MyPagePostsResponse = {
  posts: {
    id: number,
    createdAt: Date;
    shop: {
      id: number;
      prefectureId: number;
      name: string;
      address: string;
    }


    postImages: {
      imageUrl: string;
    }[];
  }[]
  totalCount: number,
}
