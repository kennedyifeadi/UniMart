export interface GoalCardProps {
  title: string
  description: string
  icon: React.ReactNode
}
export const GoalCard = ({
  title,
  description,
  icon
}: GoalCardProps) => {
  return (
    <div className="p-4 rounded-xl shadow-lg hover:shadow-xl duration-300 ease-in-out flex flex-col pt-12 items-center w-[300px] h-[350px]">
      <div className="flex items-center justify-center mb-2 bg-[#dbeafe] text-[#2563eb] p-4 rounded-full">
        {icon}
      </div>
      <h1 className="font-medium text-[18px] md:text-[20px] mb-5">{title}</h1>

      <p className="text-gray-700 text-[16px] md:text-[18px] px-4 text-center">{description}</p>
    </div>
  )
}
