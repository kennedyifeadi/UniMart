import { DynamicBackground } from "../home/DynamicBackground"
import aboutBG from "../../assets/images/UI_About.jpeg"

export const Landing = () => {
  return (
    <div className="w-full h-[80dvh] flex justify-center items-center relative flex-col text-white mb-10">
      <DynamicBackground image={aboutBG} />
      <h1 className="text-[48px] md:text-[72px] font-bold ">About Unimart</h1>
      <p className="text-center text-[16px] md:text-[24px] p-4 md:p-0 md:w-1/2 text-[#ffffffb1]">The No.1 marketplace connecting UI students with UI businesses. Building a thriving community where students discover, connect, and support each other.</p>
    </div>
  )
}
