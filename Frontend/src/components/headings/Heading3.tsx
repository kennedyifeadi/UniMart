import type { HeadingProps } from './Heading1'
    

export const Heading3 = ({ children, className }: HeadingProps) => {
  return (
    <h3 className={`text-center tracking-wide font-normal md:text-xl text-sm text-gray-700 font-heading ${className}`}>{children}</h3>
  )
}
