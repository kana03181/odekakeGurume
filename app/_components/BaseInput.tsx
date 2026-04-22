import { ComponentPropsWithRef, forwardRef } from "react";



type BaseInputProps = ComponentPropsWithRef<'input'>;

export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        {...props}
        ref={ref}
        className={`rounded-[calc(48/16*1rem)] ${className ?? ""}`}
      />
    )
  });
