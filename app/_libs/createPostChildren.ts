import { type PostsForm } from "@/app/_libs/schemas/posts.schema";

export const createPostChildren = (children: PostsForm["children"]) => {
  return children.flatMap((child) =>
    Array.from( { length: child.count }, () => ({
          age_Group: child.ageGroup,
        })
      )
    );

}
