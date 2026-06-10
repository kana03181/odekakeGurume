import { cn } from "@/app/_libs/cn";
import { SelectOption } from "@/app/_types/select";


type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectOption[]
  placeholder?: string
}

export const BaseSelect = ({
  options,
  className,
  placeholder= "--",
  ...props
}: Props) => {
  return (
    <select
      {...props}
      className={cn("rounded-[calc(48/16*1rem)]", className)}
    >
      <option value="">
        {placeholder}
      </option>

      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
