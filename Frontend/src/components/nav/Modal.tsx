import { Link } from "react-router-dom"

export const Modal = () => {
    const modalDetails = [
        {
            title: "Login",
            link: "/login"
        },
        {
            title: "Sign Up",
            link: "/signup"
        },
        {
            title: "Become a Vendor",
            link: "/becomeavendor"
        },
        {
            title: "logout",
            link: "/"
        }
    ]
  return (
    <div className="fixed top-[50px] right-12 border border-gray-200 transform bg-white py-4 rounded-lg z-50 w-48">
      {modalDetails.map((modal, index) => (
        <div key={index} className="">
          <Link to={modal.link} className="block text-gray-600 hover:text-blue-500 mb-2 px-4">
            {modal.title}
          </Link>
          {index === 1 && (
            <hr className="border-t border-gray-200 mb-4 mt-4 px-0" />
          )}
        </div>
      ))}
    </div>
  )
}
