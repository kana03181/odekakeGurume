import { ComponentPropsWithRef, forwardRef } from "react";



type Props = ComponentPropsWithRef<'input'>;

export const BaseInput = forwardRef<HTMLInputElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <input
        {...props}
        ref={ref}
        className={`rounded-[calc(48/16*1rem)] ${className ?? ""}`}
      />
    )
  });
