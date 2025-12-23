import { DynamicBackground } from "../home/DynamicBackground"
import becomeAVendorBG from "../../assets/images/BecomeAVendroBG.jpg"

export const LandingPage = () => {
  return (
    <div className="w-full h-[80dvh] flex justify-center items-center relative flex-col text-white mb-10">
      <DynamicBackground image={becomeAVendorBG} />
      <h1 className="text-[48px] md:text-[72px] text-center font-bold ">Become a Vendor at UI</h1>
      <p className="text-center text-[16px] md:text-[24px] p-4 md:p-0 md:w-1/2 text-[#ffffffb1]">Join the #1 marketplace for students. Increase your visibility, build trust, and connect directly with 5,000+ UI students.</p>
    </div>
  )
}
