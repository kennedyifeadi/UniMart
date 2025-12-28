import { Link } from "react-router-dom"
import { SearchBar } from "./SearchBar"
import { User, X, Menu } from 'lucide-react'
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Modal } from "./Modal";
import { toggleModal } from "../../store/slices/uiSlice";
 
import { useMediaQuery } from "react-responsive";

export const NavBar = () => {
  const dispatch = useDispatch()
  const { isModalOpen } = useSelector((state: RootState) => state.ui)
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
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
  const mobileMOdalList = [
        {
            title: "Login",
            link: "/login"
        },
        {
            title: "Sign Up",
            link: "/signup"
        },
  ]
  const { currentUser, role } = useSelector((state: RootState) => state.auth)

  const getInitials = (name?: string | null, email?: string | null) => {
    const source = name || email || ''
    if (!source) return ''
    const parts = source.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
  }
  return (
    <div className="w-full h-14 border-b border-gray-100 justify-between flex px-8 items-center fixed top-0 bg-white z-50">
      <div className="font-semibold text-[#2563eb] w-[25%] text-2xl" style={{ fontFamily: 'cursive' }}>UniMart</div>
      {/* Desktop Navigation */}
      <div className="gap-2  w-[35%] justify-between hidden md:flex">
        {
          navList.map((nav, index) => (
            <Link key={index} to={nav.link} className="text-gray-600 hover:text-[#2563eb] cursor-pointer font-normal text-[18px]">
              {nav.name}
            </Link>
          ))
        }
      </div>
      <div className="w-[40%] justify-end items-center hidden md:flex">
        <div className="w-[40%]">
          <SearchBar />
        </div>
        <span className="ml-4 cursor-pointer" onClick={() => dispatch(toggleModal())}>
          {currentUser ? (
            <div className="bg-[#2563eb] text-white rounded-full w-8 h-8 flex items-center justify-center font-medium">
              {getInitials(currentUser.displayName ?? (currentUser.fullName as string | undefined), currentUser.email ?? undefined)}
            </div>
          ) : (
              <span className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
              <User className="text-black" size={18} />
            </span>
          )}
        </span>
        {isModalOpen && (<Modal />)}
      </div>

      {/* Mobile Navigation */}
      <span>
        {
          isModalOpen ? <X className="md:hidden cursor-pointer" size={25} onClick={() => dispatch(toggleModal())} /> : <Menu className="md:hidden cursor-pointer" size={25} onClick={() => dispatch(toggleModal())} />
        }
        {isModalOpen && isMobile && (
          <>
            <div className="absolute top-14 right-0 bg-white shadow-lg rounded-md p-4 w-full flex flex-col gap-3.5">
              <SearchBar />
              <div className="flex flex-col gap-3">
                {navList.map((nav, index) => {
                  // replace Become a Vendor with dashboard link when logged in
                  if (nav.name === 'Become a Vendor' && currentUser) {
                    const dashName = role === 'vendor' ? 'Vendor Dashboard' : role === 'admin' ? 'Admin Dashboard' : 'Dashboard'
                    const dashLink = role === 'vendor' ? '/vendor/dashboard' : role === 'admin' ? '/admin/dashboard' : '/dashboard'
                    return (
                      <Link key={index} to={dashLink} className="block text-gray-600 hover:text-[#2563eb] cursor-pointer font-normal text-[16px]">
                        {dashName}
                      </Link>
                    )
                  }
                  return (
                    <Link key={index} to={nav.link} className="block text-gray-600 hover:text-[#2563eb] cursor-pointer font-normal text-[16px]">
                      {nav.name}
                    </Link>
                  )
                })}
              </div>
              <span className="h-[1px] w-full bg-gray-200"></span>
              <div className="flex flex-col gap-3">
                {mobileMOdalList.map((modal, index) => (
                  <Link key={index} to={modal.link} className="block text-gray-600 hover:text-blue-500 cursor-pointer font-normal text-[16px]">
                    {modal.title}
                  </Link>
                ))}
                {currentUser && (
                  <>
                    <Link to={role === 'vendor' ? '/vendor/dashboard' : role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="block text-gray-600 hover:text-blue-500 cursor-pointer font-normal text-[16px]">
                      {role === 'vendor' ? 'Vendor Dashboard' : role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </>
        )}

      </span>
    </div>
  )
}
