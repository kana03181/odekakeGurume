
type Props = React.ComponentProps<'label'>

export default function Label({children, ...props}: Props) {
  return (
    <label className="block text-sm font-medium text-primary" {...props}> { children } </label>
  )
}
