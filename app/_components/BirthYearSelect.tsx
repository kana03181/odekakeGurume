import { BaseSelect } from "@/app/_components/BaseSelect";
import { createNumberOptions } from "@/app/_libs/selectOptions";


type Props = {
  placeholder?: string
  reverse?:boolean
} & React.SelectHTMLAttributes<HTMLSelectElement>

export const BirthYearSelect = ({
  placeholder="--",
  reverse=false,
  ...props
}: Props) => {
  return (
    <BaseSelect
      {...props}
      options={createNumberOptions({
        start: 1960,
        end: new Date().getFullYear(),
        suffix: "年",
        reverse,
      })}
      placeholder={placeholder}
    />
  )
}
