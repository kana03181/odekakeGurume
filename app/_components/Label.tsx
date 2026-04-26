
type Props = React.ComponentProps<'label'>;

export default function Label({ children, ...props}: Props) {
  return (
    <label {...props}> { children } </label>
  )
}
