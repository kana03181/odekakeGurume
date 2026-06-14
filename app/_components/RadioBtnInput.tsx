import { ComponentPropsWithRef } from "react";
import { cn } from "@/app/_libs/cn";


type Props = Omit<ComponentPropsWithRef<'input'>, "type">;

export const RadioBtnInput = ({ className, ref, ...props}: Props) => {
  return (
    <input
      {...props}
      type="radio"
      ref={ref}
      className={cn(className)}
    />
  )
};
