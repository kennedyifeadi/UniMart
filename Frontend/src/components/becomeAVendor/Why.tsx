import type { ReactNode } from "react";

export interface whyBecomeAVendor {
    color: string;
    title: string;
    description: string;
    mainColor: string;
    icon: ReactNode;
}

export const Why = ({title, description, color, mainColor, icon}: whyBecomeAVendor) => {
  return (
    <div className="flex flex-col w-[250px] h-[200px] justify-center items-center">
        <div className={`rounded-full p-4 w-max h-max`} style={{backgroundColor:`${color}`, color: `${mainColor}` }}>{icon}</div>
        <div className="flex flex-col mt-4 gap-2">
            <h1 className="text-center font-medium text-lg">{title}</h1>
            <p className="text-center">{description}</p>
        </div>
    </div>
  )
}
