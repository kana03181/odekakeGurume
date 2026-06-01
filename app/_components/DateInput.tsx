import { ComponentPropsWithRef } from "react";
import { cn } from "@/app/_libs/cn";

type Props = ComponentPropsWithRef<'input'>;

export const DateInput = ({ className, type="date", ref, ...props}: Props) => {
  return (
    <input
      {...props}
      type={type}
      ref={ref}
      className={cn("rounded-[calc(48/16*1rem)]", className)}
    />
  )
};
