import { ComponentPropsWithRef } from "react";
import { BaseSelect } from "@/app/_components/BaseSelect";
import { SelectOption } from "@/app/_types/select"

type Props = ComponentPropsWithRef<'select'> & {
  options: SelectOption[]
  placeholder?: string
}

export const PrefectureSelect = ({ placeholder = "--", options, ...props}: Props) => {
  return (
    <BaseSelect
      {...props}
      placeholder={placeholder}
      options={options}
    />
  )
}
