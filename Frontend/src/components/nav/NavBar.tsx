import { Link } from "react-router-dom"
import { SearchBar } from "./SearchBar"
import { LuUserRound } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Modal } from "./Modal";
import { toggleModal } from "../../store/slices/uiSlice";

export const NavBar = () => {
  const dispatch = useDispatch()
  const { isModalOpen } = useSelector((state: RootState) => state.ui)
  const navList = [
    {
      name: "Home",
      link: "/"
    },
    {
      name: "All Vendors",
      link: "/vendors"
    },
    {
      name: "About Us",
      link: "/about"
    },
    {
      name: "Become a Vendor",
      link: "/becomeavendor"
    }
  ]
  return (
    <div className="w-full h-14 border-b border-gray-100 justify-between flex px-8 items-center">
      <div className="font-semibold text-[#2563eb] w-[25%] text-2xl" style={{fontFamily: 'cursive'}}>UniMart</div>
      <div className="flex gap-2  w-[35%] justify-between">
        {
          navList.map((nav, index) => (
            <Link key={index} to={nav.link} className="text-gray-600 hover:text-[#2563eb] cursor-pointer font-normal text-[16px]">
              {nav.name}
            </Link>
          ))
        }
      </div>
      <div className="w-[40%] flex justify-end items-center">
        <SearchBar />
        <span className="ml-4 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer" onClick={() => dispatch(toggleModal())}>
          <LuUserRound className="text-black" size={18} />
        </span>
        {isModalOpen && (<Modal />)}
      </div>
    </div>
  )
}
