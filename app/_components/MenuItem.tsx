import Link from "next/link";
import { cn } from "@/app/_libs/cn";

type Props = {
  className?: string;
  href: string;
  children: React.ReactNode;
}

export const MenuItem = ({ className, href, children }: Props) => {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "inline-block text-sm font-medium rounded-[calc(32/16*1rem)] py-5 px-5 bg-(--bg-primary) w-full",
          className
        )}
      >
        {children}
      </Link>
    </li>
  )
}
