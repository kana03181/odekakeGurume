import { SelectOption } from "@/app/_types/select";

type createNumberOptionProps = {
  start: number
  end: number
  suffix?: string
  reverse?: boolean
}

export const createNumberOptions = ({
  start,
  end,
  suffix = "",
  reverse = false,
}: createNumberOptionProps): SelectOption[] => {

  const arr = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  )

  const numbers = reverse
    ? arr.reverse()
    : arr

  return numbers.map((n) => ({
    value: String(n),
    label: `${n}${suffix}`,
  }))
}
