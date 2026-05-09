import { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<"textarea">;

const TextArea = ({ className, rows = 5, id, ref, ...props }:Props) => {
  return (
    <textarea
      {...props}
      id={id}
      rows={rows}
      ref={ref}
      className={`rounded-[calc(24/16*1rem)] w-full p-4 ${className ?? ""}`}
    />
  );
  }


export default TextArea;
