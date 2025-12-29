import { DynamicBackground } from "./DynamicBackground"
import Bg from "../../assets/images/Aerial_view_in_University_of_Ibadan.jpg"
import { Button } from "../buttonb/Button"

export const LandingPage = () => {
    return (
        <div className='w-full h-[100dvh] flex gap-4 relative'>
            <DynamicBackground image={Bg} />
            <div className='w-full h-full flex flex-col justify-center text-white gap-4 md:gap-6 px-4 md:pl-36 pl-6'>
                <h1 className='md:text-[64px] text-[36px] w-[95%] md:w-[60%] md:leading-16 font-bold font-heading'>The No.1 Marketplace for UI Students</h1>
                <span className="md:text-2xl text-lg md:font-medium">Discover. Connect. Support.</span>
                <p className="md:text-[18px] text-[16px] md:w-[60%]">Connect with fellow students, discover local businesses, and support your campus community. Your one-stop marketplace for everything student life.</p>
                <div className="flex gap-4 md:flex-row flex-col">
                    <Button classname="!bg-[#2563eb] hover:!bg-[#0a54f4]">Explore Local Business</Button>
                    <Button classname="border border-white hover:bg-white hover:text-black">Start Selling</Button>
                </div>
            </div>
        </div>
    )
}
