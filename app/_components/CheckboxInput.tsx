import { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<'input'>;

export const CheckboxInput = ({ className, type="checkbox", ref, ...props}: Props) => {
  return (
    <input
      {...props}
      type={type}
      ref={ref}
      className={`appearance-none ${className ?? ""}`}
    />
  )
};
