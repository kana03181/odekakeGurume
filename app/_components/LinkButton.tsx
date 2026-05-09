import { ComponentPropsWithRef } from "react";
import Link from "next/link";


type Variant = "primary" | "outline";

type LinkButtonProps =  ComponentPropsWithRef<typeof Link> & {
  variant?: Variant
}

export const LinkButton = ({ variant = "primary", className, href,  children, ...props }: LinkButtonProps) => {
  const base = "w-full focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[calc(48/16*1rem)] text-[calc(18/16*1rem)] leading-normal px-5 py-[calc(16/16*1rem)] text-center"

  const variants = {
    primary: "bg-[#FF9F43] hover:bg-[#FBB97B] text-white",
    outline: "bg-[#FFFFFF] hover:bg-[#FF9F43] text-[#FF9F43] hover:text-[#FFFFFF] border-2 border-solid border-[#FF9F43]"
  }

  return (
    <Link
      {...props}
      href={href}
      className={`${base} ${variants[variant]} ${className ?? ""}`}
    >
      {children}
    </Link>
  )
}
