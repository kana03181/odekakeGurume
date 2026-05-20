
type Option = {
  value: string
  label: string
}

type GeneratorType = "year" | "month" | "day" | "number"

type GeneratorConfig = {
  type: GeneratorType
  start?: number
  end?: number
  reverse?: boolean
}

type Props = {
  options?: Option[]
  generator?: GeneratorConfig
  placeholder?: string
} & React.SelectHTMLAttributes<HTMLSelectElement>

const generateOptions = (config: GeneratorConfig): Option[] => {
  const { type, start, end, reverse } = config

  let arr: number[] = []

  switch (type) {
    case "year" :
      const sYear = start ?? 1960
      const eYear = end ?? new Date().getFullYear()
      arr = Array.from({ length: eYear - sYear + 1 }, (_, i) => sYear + i)
      break

    case "month":
      arr = Array.from({ length: 12 }, (_, i) => i + 1)
      break

    case "day":
      arr = Array.from({ length: 31 }, (_, i) => i + 1)
      break

    case "number":
      const s = start ?? 0
      const e = end ?? 10
      arr = Array.from({ length: e - s + 1 }, (_, i) => s + i)
      break
  }

  if (reverse) arr = arr.reverse()

  return arr.map((n) => ({
    value: String(n),
    label: String(n),
  }))
}

export const SelectBox = ({
  options,
  generator,
  className,
  placeholder="選択してください",
  ...props }: Props) => {
  const finalOptions = generator
    ? generateOptions(generator)
    : options ?? []


  return (
    <select
      {...props}
      className={`rounded-[calc(48/16*1rem)] ${className ?? ""}`}
    >
      <option value="">{placeholder}</option>
      {finalOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
        ))}
    </select>
  )
};
