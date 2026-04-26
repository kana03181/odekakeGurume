import { ComponentPropsWithRef, forwardRef } from "react";
// import { BaseInput } from "@/app/_components/BaseInput";


type Props = ComponentPropsWithRef<'input'>;

export const TextInput = ({ className, ref, ...props}: Props) => {
  return (
    <input
      {...props}
      ref={ref}
      className={`rounded-[calc(48/16*1rem)] ${className ?? ""}`}
    />
  )
};
