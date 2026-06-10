import { ComponentPropsWithRef } from "react";
import { cn } from "@/app/_libs/cn";

type Props = Omit<ComponentPropsWithRef<'input'>, "type">;

export const DateInput = ({ className, ref, ...props}: Props) => {
  return (
    <input
      {...props}
      type="date"
      ref={ref}
      className={cn("rounded-[calc(48/16*1rem)]", className)}
    />
  )
};
