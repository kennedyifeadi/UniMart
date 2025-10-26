
export interface StoryProps {
  title: string
  description: string
}
export const Story = ({ title, description }: StoryProps) => {
  return (
    <div className="w-full h-max flex flex-col gap-2">
      <h2 className=" font-medium md:text-xl text-lg">{title}</h2>
      <p className="text-gray-700 text-sm md:text-lg">{description}</p>
    </div>
  )
}
