import { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<'input'>;

export const CheckboxInput = ({ className, type="checkbox", ref, ...props}: Props) => {
  return (
    <input
      {...props}
      ref={ref}
      className={`rounded-[calc(32/16*1rem)] ${className ?? ""}`}
    />
  )
};
