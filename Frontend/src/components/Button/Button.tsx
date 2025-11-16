export interface ButtonProps {
  classname?: string
  children: React.ReactNode
}
export const Button = ({ children, classname }: ButtonProps) => {
  return (
    <div className={`bg-transparent w-full md:w-auto duration-300 ease-in-out font-medium text-white text-[18px] px-6 py-4 rounded-md cursor-pointer ${classname}`}>{children}</div>
  )
}
