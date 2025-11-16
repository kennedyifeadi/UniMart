import { ImLinkedin2,ImGithub } from "react-icons/im";
import { Link } from "react-router-dom";


export interface TeamCardProps {
  name: string
  role: string
  bio: string
  image: string
  linkedin?: string
  instagram?: string
}
export const TeamCard = ({ name, role, bio, image, linkedin, instagram }: TeamCardProps) => {
  return (
    <div className="p-4 rounded-xl cursor-pointer group shadow-lg hover:shadow-xl duration-300 ease-in-out flex flex-col items-center w-[90%] md:w-[300px] h-[380px]">
      <div className="w-full h-[40%] flex justify-center">
        <div className="w-32 h-32 relative">
          <div className="absolute top-0 bg-[#2564eb22] rounded-full w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <img src={image} alt={name} className="rounded-full w-full h-full object-cover " />
        </div>
      </div>
      <div className="flex flex-col gap-4 h-[60%] items-center text-center mt-4">
        <h1 className="font-medium text-2xl">{name}</h1>
        <h2 className="text-[#2563eb] font-medium text-xl">{role}</h2>
        <span className="text-gray-600 text-sm">{bio}</span>
        <span className="flex gap-2">
          <Link to={linkedin ? linkedin : "#"} className="rounded-full w-8 h-8 bg-gray-200 flex justify-center items-center"><ImLinkedin2 size={16} /></Link>
          <Link to={instagram ? instagram : "#"} className="rounded-full w-8 h-8 bg-gray-200 flex justify-center items-center"><ImGithub size={16} /></Link>
        </span>
      </div>
    </div>
  )
}
