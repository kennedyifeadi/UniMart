import { Socials, type SocialsProps } from "./Socials"
import { RiInstagramFill } from "react-icons/ri";
import { RiFacebookFill } from "react-icons/ri";
import { RiTwitterFill } from "react-icons/ri";
import { RiLinkedinFill } from "react-icons/ri";


export const Footer = () => {
  const SocialsList: SocialsProps[] = [
    {
      link: "/",
      icon: <RiInstagramFill size={20} />
    },
    {
      link: "/",
      icon: <RiFacebookFill size={20} />
    },
    {
      link: "/",
      icon: <RiTwitterFill size={20} />
    },
    {
      link: "/",
      icon: <RiLinkedinFill size={20} />
    },
  ]
  const QuickLinks = [
    {
      title: "About Us",
      link: "/about"
    },
    {
      title: "All Vendors",
      link: "/vendors"
    },
    {
      title: "Become a Vendor",
      link: "/become-a-vendor"
    },
    {
      title: "Contact Us",
      link: "/contact"
    }
  ]

  const legalLinks = [
    {
      title: "Privacy Policy",
      link: "/"
    },
    {
      title: "Terms of Service",
      link: "/"
    },
    {
      title: "Cookie Policy",
      link: "/"
    },
  ]
  return (
    <div className="w-full p-8 md:px-24 flex flex-col md:py-14 gap-4 bg-[#111827] text-white">
      <div className="flex flex-wrap w-full justify-between">
        <div className="w-full md:w-1/2 flex flex-col mb-10 md:mb-0">
          <h1 className="font-semibold text-[#2563eb] w-[25%] text-3xl" style={{ fontFamily: 'cursive' }}>UniMart</h1>
          <p className="text-lg mt-4">The No.1 Marketplace for UI Students. Connecting students with local businesses and opportunities.</p>
          <span className="flex gap-2 mt-6">
            {
              SocialsList.map((social, index) => (
                <Socials key={index} {...social} />
              ))}   
          </span>
        </div>
        <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-10 md:gap-0 md:px-4">
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="font-semibold text-xl">Quick Links</h1>
            <span className="flex flex-col mt-4 text-lg gap-2">
              {
                QuickLinks.map((link, index) => (
                  <a key={index} href={link.link} className="text-gray-300 hover:text-[#2563eb] w-max">{link.title}</a>
                ))
              }
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="font-semibold text-xl">Legal</h1>
            <span className="flex flex-col mt-4 text-lg gap-2">
              {
                legalLinks.map((link, index) => (
                  <a key={index} href={link.link} className="text-gray-300 hover:text-[#2563eb] w-max">{link.title}</a>
                ))
              }
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-gray-800 mt-10"></div>
      <div className="mt-4 flex justify-center">
        <span className="text-gray-500 text-center">
          © {new Date().getFullYear()} Unimart. All rights reserved. Made for UI Students.
        </span>
      </div>
    </div>
  )
}
