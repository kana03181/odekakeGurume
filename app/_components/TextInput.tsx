import { ComponentPropsWithRef, forwardRef } from "react";
import { BaseInput } from "@/app/_components/BaseInput";


type TextInputProps = ComponentPropsWithRef<'input'>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseInput
        {...props}
        ref={ref}
        className={ className }
      />
    )
  });
