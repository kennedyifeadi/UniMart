import type { HeadingProps } from "./Heading1"

export const Heading2 = ({ children, className }: HeadingProps) => {
  return (
    <h2 className={`text-2xl md:text-4xl text-center font-bold md:mb-3 font-heading ${className}`}>{children}</h2>
  )
}
