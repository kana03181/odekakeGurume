
type Props = React.ComponentProps<'label'> &{
  htmlFor?: string;
}

export default function Label({ htmlFor, children, ...props}: Props) {
  return (
    <label htmlFor={htmlFor} {...props}> { children } </label>
  )
}
