import { BaseSelect } from "@/app/_components/BaseSelect";
import { prefectureOptions } from "@/app/_libs/selectOptions";

type Props = {
  placeholder?: string
} & React.SelectHTMLAttributes<HTMLSelectElement>

export const PrefectureSelect = ({
  placeholder = "--",
  ...props
}: Props) => {
  return (
    <BaseSelect
      {...props}
      placeholder={placeholder}
      options={prefectureOptions}
    />
  )
}
