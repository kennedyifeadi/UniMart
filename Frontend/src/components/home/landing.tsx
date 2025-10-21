import { DynamicBackground } from "./DynamicBackground"
import Bg from "../../assets/images/Aerial_view_in_University_of_Ibadan.jpg"

export const LandingPage = () => {
    return (
        <div className='w-full h-[100dvh] flex gap-4 relative'>
            <DynamicBackground image={Bg} />
            <div className='w-full h-full flex flex-col justify-center text-white gap-4 md:gap-6 px-4 md:pl-36 pl-6'>
                <h1 className='md:text-[64px] text-[36px] w-[95%] md:w-[60%] md:leading-16 font-bold'>The No.1 Marketplace for UI Students</h1>
                <span className="md:text-2xl text-lg md:font-medium">Discover. Connect. Support.</span>
                <p className="md:text-[18px] text-[16px] md:w-[60%]">Connect with fellow students, discover local businesses, and support your campus community. Your one-stop marketplace for everything student life.</p>
                <div className="flex gap-4 md:flex-row flex-col">
                    <span className="bg-[#2563eb] w-full md:w-auto hover:bg-[#0a54f4] duration-300 ease-in-out font-medium text-white text-[18px] px-6 py-4 rounded-md cursor-pointer">Explore Local Business</span>
                    <span className="border border-white w-full md:w-auto font-medium hover:bg-white text-white hover:text-black duration-300 ease-in-out text-[18px] px-6 py-4 rounded-md cursor-pointer">Start Selling</span>
                </div>
            </div>
        </div>
    )
}
