import { Star } from 'lucide-react'

export interface StoryProps {
  name: string;
  testimonial: string;
  rating: number;
  faculty: string;
  image: string;
}
export const StudentCard = ({ name, testimonial, rating, faculty, image }: StoryProps) => {
  return (
    <div className="w-[90%] h-[300px] md:w-[650px] md:h-[250px] flex gap-1 shadow-xl rounded-2xl p-4 pt-10 hover:shadow-2xl duration-300 ease-in-out cursor-pointer">
      <div className="w-[30%] md:w-[20%]">
        <img src={image} alt={`${name}'s profile`} className="rounded-full w-20 h-20 md:w-24 md:h-24" />
      </div>
      <div className="w-[70%] md:w-[80%] flex flex-col gap-2">
        <span className="text-[#facc15] flex ">
          {Array.from({ length: rating }, (_, i) => (
            <Star key={i} size={24} />
          ))}
        </span>
        <p className="text-gray-700 text-sm md:text-lg">{testimonial}</p>
        <span>
          <h2 className=" font-medium md:text-xl text-lg">{name}</h2>
          <p className="text-gray-700 text-sm md:text-md">{faculty}</p>
        </span>
      </div>
    </div>
  )
}
