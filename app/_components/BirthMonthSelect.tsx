import { BaseSelect } from "@/app/_components/BaseSelect";
import { createNumberOptions } from "@/app/_libs/selectOptions";

type Props = {
  placeholder?: string
}& React.SelectHTMLAttributes<HTMLSelectElement>

export const BirthMonthSelect = ({
  placeholder = "--",
  ...props
}: Props) => {
  return (
    <BaseSelect
      {...props}
      options={createNumberOptions({
        start: 1,
        end: 12,
        suffix: "月"
      })}
      placeholder={placeholder}
    />
  )
}
