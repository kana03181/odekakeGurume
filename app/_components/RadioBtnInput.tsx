import { ComponentPropsWithRef } from "react";
import { cn } from "@/app/_libs/cn";


type Props = ComponentPropsWithRef<'input'>;

export const RadioBtnInput = ({ className, type="radio", ref, ...props}: Props) => {
  return (
    <input
      {...props}
      type={type}
      ref={ref}
      className={cn(className)}
    />
  )
};
