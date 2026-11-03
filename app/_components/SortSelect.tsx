import { useState } from "react";
import { isSortType, type SortType } from "@/app/_types/sort";
import Image from "next/image";


type SortSelectProps = {
  value: SortType;
  onChange: (value:SortType ) => void;
}

export const SortSelect = ({
  value,
  onChange
}: SortSelectProps) => {

  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: "newest", label: "新着順" },
    { value: "rating_desc", label: "評価が高い順" },
    { value: "distance_asc", label: "現在地から近い順" },
  ];

  const handleSortChange = (selectedValue: string) => {
    if(isSortType(selectedValue)){
      onChange(selectedValue)
      setIsOpen(false);
    }
  }


  return (
    <div className="relative w-11 h-11">
      <button
        type="button"
        className="text-sm font-medium w-full border border-solid posts-border-primary rounded-full object-cover aspect-square posts-bg-primary shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="並び替えメニューを開く"
        aria-expanded={isOpen}
      >
        <Image
          src="/posts/sort.svg"
          className="mx-auto"
          width={18}
          height={12}
          priority
          alt=""
        />
      </button>

      {isOpen && (
        <ul className="absolute right-0 top-full z-10 mt-2 min-w-40 rounded-lg border border-solid posts-border-primary p-2 shadow-md posts-detail-bg">
          {sortOptions.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => handleSortChange(option.value)}
                className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 text-primary ${
                  value === option.value
                  ? "font-bold"
                  : ""
                }` }
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
