import { Star } from 'lucide-react'

export interface TestimonialsCardProps {
  name: string;
  feedback: string;
  image: string;
  rating: number;
  faculty: string;
}

export const TestimonialsCard = ({ name, feedback, image, rating, faculty }: TestimonialsCardProps) => {
  return (
    <div className="w-full md:w-full lg:w-[65%] h-[350px] rounded-2xl bg-white shadow-2xl p-4 flex flex-col gap-6 justify-center items-center">
        <span className="text-[#facc15] flex ">
          {Array.from({ length: rating }, (_, i) => (
            <Star key={i} size={24} />
          ))}
        </span>
        <p className="text-gray-700 md:text-2xl text-md px-2 text-center">{feedback}</p>
        <div className="flex items-center">
            <span className="md:w-20 md:h-20 w-16 h-16 rounded-full overflow-hidden mr-4">
                <img src={image} alt={name} className="w-full h-full"/>
            </span>
            <span className="flex flex-col">
                <h2 className="font-medium md:text-lg text-md">{name}</h2>
                <p className="text-gray-700 text-sm md:text-md">{faculty}</p>
            </span>
        </div>
    </div>
  )
}
