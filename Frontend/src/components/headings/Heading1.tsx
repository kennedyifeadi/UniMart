export type HeadingProps = {
  children: React.ReactNode
  className?: string
}
export const Heading1 = ({ children, className }: HeadingProps) => {
  return (
    <h1 className={`text-3xl md:text-5xl text-center font-bold md:mb-3 font-heading ${className}`}>{children}</h1>
  )
}
