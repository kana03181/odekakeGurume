import { ComponentPropsWithRef } from "react";
import { cn } from "@/app/_libs/cn";


type Props = ComponentPropsWithRef<'input'>;

export const CheckboxInput = ({ className, type="checkbox", ref, ...props}: Props) => {
  return (
    <input
      {...props}
      type={type}
      ref={ref}
      className={cn(className)}
    />
  )
};
