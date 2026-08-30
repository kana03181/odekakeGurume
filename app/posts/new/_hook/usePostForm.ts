import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postsSchema, type PostsForm } from "@/app/_libs/schemas/posts.schema";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";


export const usePostForm = () => {
  const { token, isLoading: isSessionLoading } = useSupabaseSession()

  const methods = useForm<PostsForm>({
    mode: "onChange",
    defaultValues: {
      shopName: "",
      comment: "",
      postsImageUrl: [],
      children: [],
      rating: 0,
    },
    resolver: zodResolver(postsSchema),
  });

  const {
    control,
    setValue,
    watch,
    reset,
    getValues,
  } = methods

  const children = useWatch({
    control,
    name:"children"
  })

  const handleIncrease = (index: number) => {
    const currentCount = children[index].count;

    setValue(
      `children.${index}.count`,
      currentCount + 1
    );
  };

  const handleDecrease = (index: number) => {
    const currentCount = children[index].count;

    setValue(
      `children.${index}.count`,
      Math.max( 0, currentCount - 1 )
    );
  };

  const postsSubmit = async (data: PostsForm) => {
    console.log(data);
    console.log("送信完了");
  }

  return {
    methods,
    children,
    watch,
    setValue,
    getValues,
    handleIncrease,
    handleDecrease,
    postsSubmit,
  }


}
