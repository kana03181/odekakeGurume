
export type SortType = "newest" | "rating_desc" | "distance_asc";

export const allowedSortTypes: readonly SortType[] = [
  "newest",
  "rating_desc",
  "distance_asc",
];

export function isSortType(value:String): value is SortType {
  return allowedSortTypes.some(
    (sortType) => sortType === value
  )
}
