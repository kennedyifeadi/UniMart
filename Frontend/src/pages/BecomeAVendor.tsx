import { LandingPage } from "../components/becomeAVendor/LandingPage"
import { Why } from "../components/becomeAVendor/Why"
import { Heading1 } from "../components/headings/Heading1"
import { Heading3 } from "../components/headings/Heading3"
import { MdOutlineVerifiedUser } from "react-icons/md";
import { FaChartLine } from "react-icons/fa6";
import { MdWhatsapp } from "react-icons/md";
import { RiRocketLine } from "react-icons/ri";





export const BecomeAVendor = () => {
  const why = [
    {
      title: "Boost Visibility",
      description: "Get discovered by thousands of UI students looking for your services",
      color: "#dbeafe",
      mainColor: "#2563eb",
      icon: <FaChartLine size={30} />
    },
    {
      title: "Get Verified",
      description: "Build trust with an official UI verification badge",
      color: "#dcfce7",
      mainColor: "#16a34a",
      icon: <MdOutlineVerifiedUser size={30} />
    },
    {
      title: "Direct Contact",
      description: "Connect instantly with customers through WhatsApp integration",
      color: "#f3e8ff",
      mainColor: "#af48eb",
      icon: <MdWhatsapp size={30} />
    },
    {
      title: "Grow Community",
      description: "Build your customer base within the UI student community",
      color: "#ffedd5",
      mainColor: "#ea580c", 
      icon: <RiRocketLine size={30} />
    }
  ]
  return (
    <div className="flex flex-col w-full h-max relative">
      {/* Become a Vendor Landing Page Section */}
      <LandingPage />
      {/* Why Become a Vendor Section */}
      <div className="flex flex-col mb-10 gap-10">
        <div className="flex flex-col px-2">
          <Heading1>Why Become a Vendor?</Heading1>
          <Heading3>Join hundreds of successful student entrepreneurs</Heading3>
          <div className="flex flex-wrap w-full justify-center gap-4 mt-10">
            {
              why.map( (item, index) =>(
                <Why {...item} key={index} />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default BecomeAVendor

