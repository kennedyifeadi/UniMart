import { Link } from "react-router-dom";

export type SocialsProps = {
    link: string;
    icon: React.ReactNode;
}

export const Socials = ({ link, icon }: SocialsProps) => {
  return (
    <div className="w-12 h-12 rounded-full bg-[#1f2937]">
      <Link to={link} target="_blank" rel="noopener noreferrer" className="w-full h-full flex justify-center items-center text-white">
        {icon}
      </Link>
    </div>
  )
}
