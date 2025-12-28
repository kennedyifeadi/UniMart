import { CheckCircle } from 'lucide-react'
import { Link } from "react-router-dom";

export interface FeaturedVendorsCardProps {
    name: string;
    description: string;
    link: string;
    category: string;
    verified: boolean;
    image: string;
}

export const FeaturedVendorsCard = ({
    name,
    description,
    link,
    category,
    verified,
    image
}: FeaturedVendorsCardProps) => {
    return (
        <div className='w-[300px] h-[420px] shadow-lg bg-white rounded-xl overflow-hidden m-4 flex flex-col cursor-pointer group'>
            <div className="flex relative w-full h-1/2 overflow-hidden">
                <span className="flex justify-between w-full h-max z-10 p-2">
                    <span className="w-max rounded-full px-3 text-sm py-[1px] bg-[#2563eb] flex justify-center items-center text-white">{category}</span>
                    <span>
                        {verified && <span className="bg-[#22c55e] w-5 h-5 rounded-full flex justify-center items-center"><CheckCircle fill="white" size={12} /></span>}
                    </span>
                </span>
                <img src={image} alt={name} className='w-full h-full object-cover absolute top-0 group-hover:scale-105 transition-transform duration-300 ease-in-out' />
            </div>
            <div className="px-4 flex flex-col py-6 h-1/2 justify-between">
                <span className="flex flex-col gap-2">
                    <h1 className="text-xl font-medium">{name}</h1>
                    <p className="text-gray-600 text-md pr-6">{description}</p>
                </span>
                <Link to={link} className="bg-[#2563eb] py-[10px] px-[14px] rounded-lg text-white w-max">Visit Vendors Page</Link>
            </div>
        </div>
    )
}
