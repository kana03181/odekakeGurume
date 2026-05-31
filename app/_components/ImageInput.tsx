import { ComponentPropsWithRef } from "react";
import { cn } from "../_libs/cn";
// import { BaseInput } from "@/app/_components/BaseInput";


type Props = ComponentPropsWithRef<'input'>;

export const ImageInput = ({ className, ref, ...props}: Props) => {
  return (
    <input
      {...props}
      ref={ref}
      type="file"
      accept="image/*"
      className={cn( "hidden", className )}
    />
  )
};
