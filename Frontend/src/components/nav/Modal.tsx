import { Link } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../store/store'
import { logoutUser } from '../../store/slices/authSlice'
import { logout as firebaseLogout } from '../../services/authService'
import { toggleModal } from '../../store/slices/uiSlice'

export const Modal = () => {
  const { currentUser, role } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      await firebaseLogout()
    } catch {
      // ignore
    }
    dispatch(logoutUser())
    dispatch(toggleModal())
  }

  if (!currentUser) {
    const modalDetails = [
      { title: 'Login', link: '/login' },
      { title: 'Sign Up', link: '/signup' },
      { title: 'Become a Vendor', link: '/becomeavendor' },
    ]

    return (
      <div className="fixed top-[50px] right-12 border border-gray-200 transform bg-white py-4 rounded-lg z-50 w-48">
        {modalDetails.map((modal, index) => (
          <div key={index} className="">
            <Link to={modal.link} className="block text-gray-600 hover:text-blue-500 mb-2 px-4">
              {modal.title}
            </Link>
            {index === 1 && <hr className="border-t border-gray-200 mb-4 mt-4 px-0" />}
          </div>
        ))}
      </div>
    )
  }

  // logged in
  const dashLink = role === 'vendor' ? '/vendor/dashboard' : role === 'admin' ? '/admin/dashboard' : '/dashboard'
  const dashTitle = role === 'vendor' ? 'Vendor Dashboard' : role === 'admin' ? 'Admin Dashboard' : 'Dashboard'

  return (
    <div className="fixed top-[50px] right-12 border border-gray-200 transform bg-white py-4 rounded-lg z-50 w-48">
      <Link to={dashLink} className="block text-gray-600 hover:text-blue-500 mb-2 px-4">
        {dashTitle}
      </Link>
      <Link to="/profile" className="block text-gray-600 hover:text-blue-500 mb-2 px-4">Profile</Link>
      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-600 hover:text-blue-500">Logout</button>
    </div>
  )
}
