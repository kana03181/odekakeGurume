import { BaseSelect } from "@/app/_components/BaseSelect";
import { prefectureOptions } from "@/app/_libs/selectOptions";
import { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<'select'> & {
  placeholder?: string
}

export const PrefectureSelect = ({ placeholder = "--", ...props}: Props) => {
  return (
    <BaseSelect
      {...props}
      placeholder={placeholder}
      options={prefectureOptions}
    />
  )
}
