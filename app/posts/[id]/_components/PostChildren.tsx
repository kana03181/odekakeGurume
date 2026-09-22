import { usePublicFetch } from "@/app/_hooks/usePublicFetch";
import { type AgeGroupOptions } from "@/app/_types/ageGroup";

// PostChildrenが受け取るpropsの型を定義
type PostChildrenProps = {
  postChildren: {
    ageGroup: string;
  }[];
};

// 子どもの年齢と人数を表示するコンポーネント
export const PostChildSection = ({
  // propsからPostChildrenPropsを受け取る
  postChildren
}: PostChildrenProps) => {
  // 年齢グループごとの人数を集計する
  const { data: ageGroups } = usePublicFetch<AgeGroupOptions[]>("/api/ageGroups");



  const ageGroupCounts = postChildren.reduce(
    (counts, child) => {
      // 現在の子どものageGroupをキーにして人数を1増やす
      counts[child.ageGroup] = (counts[child.ageGroup] ?? 0) + 1;

      // 次の処理でも集計結果を使う
      return counts;
    },
    // 最初は空のオブジェクトから集計を始める
    {} as Record<string, number>
  );

  // 集計した年齢グループを画面に表示する
  return (
    <>
      { Object.entries(ageGroupCounts).map(([ageGroup, count]) => {
        const ageGroupOption = ageGroups?.find(
          (option) => option.value === ageGroup
        );

        if (!ageGroupOption) return null;

        return (
          // 年齢グループごとに1つの表示を作る
          <p key={ageGroup} className="posts-bg-primary px-5 py-3 rounded-2xl text-primary text-sm font-medium">
              {/* 子どもの人数を表示する */}
            {count}人 / {ageGroupOption.label}
          </p>

        )
      })}
    </>
  )
}
