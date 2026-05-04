import { ComponentPropsWithRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "disabled";

interface Props extends ComponentPropsWithRef<"button">{
  variant?: Variant
}

export const Button = ({ variant = "primary", className, children, ref, ...props }: Props) => {
  const base = "w-full focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[calc(48/16*1rem)] text-[calc(18/16*1rem)] leading-normal px-5 py-[calc(16/16*1rem)] text-center"

  const variants = {
    primary: "bg-[#FF9F43] hover:bg-[#FBB97B] text-white",
    secondary: "bg-[#BA1A1A] hover:bg-[#FBB97B] text-[#BA1A1A]", //仮で入れてます。後ほど色変更予定
    disabled: "bg-[#AAA9A8] hover:bg-[#FBB97B] text-white",
    outline: "bg-[#FFFFFF] hover:bg-[#FF9F43] text-[#FF9F43] border-2 border-solid border-[#FF9F43]"
  }

  return (
    <button
      ref={ref}
      {...props}
      className={`${base} ${variants[variant]} ${className ?? ""}`}
    >
      {children}
    </button>
  )
}
